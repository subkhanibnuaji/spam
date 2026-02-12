"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  RefreshCw,
  CheckCircle2,
  Camera,
  Clock,
  LogIn,
  LogOut,
  AlertCircle,
  XCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CameraCapture } from "@/components/presensi/camera-capture";
import { AttendanceLog } from "@/components/presensi/attendance-log";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  type AttendanceRecord,
  type UserProfile,
  getUserProfile,
  getTodayRecords,
  hasCheckedInToday,
  hasCheckedOutToday,
  saveAttendanceRecord,
  findNearestLocation,
  formatIndonesianDate,
  formatTime,
  generateId,
  ATTENDANCE_LOCATIONS,
} from "@/lib/attendance";

// Dynamic import for Leaflet map (no SSR)
const AttendanceMap = dynamic(
  () =>
    import("@/components/presensi/attendance-map").then(
      (mod) => mod.AttendanceMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center rounded-lg bg-gray-100">
        <MapPin className="h-6 w-6 animate-pulse text-muted-foreground" />
      </div>
    ),
  }
);

type TabType = "beranda" | "presensi";

export default function PresensiPage() {
  const [activeTab, setActiveTab] = useState<TabType>("presensi");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [nearestLocation, setNearestLocation] = useState<{
    name: string;
    distance: number;
    withinArea: boolean;
    lat: number;
    lng: number;
    radius: number;
  } | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraType, setCameraType] = useState<"check-in" | "check-out">(
    "check-in"
  );
  const [logOpen, setLogOpen] = useState(false);
  const [locationInfoOpen, setLocationInfoOpen] = useState(false);
  const [todayRecords, setTodayRecords] = useState<AttendanceRecord[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Load user profile on client
  useEffect(() => {
    setUser(getUserProfile());
  }, []);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Load today's records
  useEffect(() => {
    setTodayRecords(getTodayRecords());
    setCheckedIn(hasCheckedInToday());
    setCheckedOut(hasCheckedOutToday());
  }, []);

  // Get location
  const refreshLocation = useCallback(() => {
    setLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation tidak didukung browser Anda");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        const nearest = findNearestLocation(latitude, longitude);
        if (nearest) {
          setNearestLocation({
            name: nearest.location.name,
            distance: nearest.distance,
            withinArea: nearest.distance <= nearest.location.radius,
            lat: nearest.location.lat,
            lng: nearest.location.lng,
            radius: nearest.location.radius,
          });
        }
        setLocationLoading(false);
      },
      (err) => {
        setLocationError(
          err.code === 1
            ? "Izin lokasi ditolak. Aktifkan GPS Anda."
            : "Gagal mendapatkan lokasi. Coba lagi."
        );
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []);

  // Auto-detect location on mount
  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  const handleCheckIn = () => {
    setCameraType("check-in");
    setCameraOpen(true);
  };

  const handleCheckOut = () => {
    setCameraType("check-out");
    setCameraOpen(true);
  };

  const handlePhotoCapture = (photoDataUrl: string) => {
    if (!userLocation) return;

    const record: AttendanceRecord = {
      id: generateId(),
      date: new Date().toISOString().split("T")[0],
      type: cameraType,
      timestamp: new Date().toISOString(),
      location: {
        lat: userLocation.lat,
        lng: userLocation.lng,
        name: nearestLocation?.name || "Unknown",
      },
      photo: photoDataUrl,
      withinArea: nearestLocation?.withinArea || false,
    };

    saveAttendanceRecord(record);
    setTodayRecords(getTodayRecords());

    if (cameraType === "check-in") {
      setCheckedIn(true);
    } else {
      setCheckedOut(true);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .filter((c) => c && c === c.toUpperCase())
      .slice(0, 2)
      .join("");
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-md pb-4">
      {/* Tab Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-1 pt-1">
        <div className="flex">
          <button
            onClick={() => setActiveTab("beranda")}
            className={`flex-1 rounded-t-lg px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === "beranda"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-blue-100 hover:text-white"
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => setActiveTab("presensi")}
            className={`flex-1 rounded-t-lg px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === "presensi"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-blue-100 hover:text-white"
            }`}
          >
            Presensi
          </button>
        </div>
      </div>

      {activeTab === "beranda" ? (
        <BerandaContent user={user} todayRecords={todayRecords} />
      ) : (
        <div className="space-y-4 bg-white p-4">
          {/* Title + Refresh */}
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">Presensi</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshLocation}
              disabled={locationLoading}
              className="gap-1.5 border-blue-200 text-xs text-blue-600 hover:bg-blue-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${locationLoading ? "animate-spin" : ""}`}
              />
              Refresh Lokasi
            </Button>
          </div>

          {/* Profile Card */}
          <Card className="border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-md">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">
                  {user.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user.shift} ({user.shiftStart} - {user.shiftEnd})
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status Items */}
          <Card>
            <CardContent className="space-y-3 p-4">
              {/* Location */}
              <StatusRow
                icon={<MapPin className="h-5 w-5 text-blue-600" />}
                text={
                  locationLoading
                    ? "Mendeteksi lokasi..."
                    : locationError
                      ? locationError
                      : nearestLocation
                        ? nearestLocation.name
                        : "Lokasi tidak ditemukan"
                }
                loading={locationLoading}
              />

              {/* Within Area */}
              <StatusRow
                icon={
                  nearestLocation?.withinArea ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : nearestLocation ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                  )
                }
                text={
                  nearestLocation?.withinArea
                    ? "Dalam area"
                    : nearestLocation
                      ? `Di luar area (${Math.round(nearestLocation.distance)}m)`
                      : "Menunggu lokasi..."
                }
                textClass={
                  nearestLocation?.withinArea
                    ? "text-green-700"
                    : nearestLocation
                      ? "text-red-600"
                      : "text-muted-foreground"
                }
              />

              {/* Method */}
              <StatusRow
                icon={<Camera className="h-5 w-5 text-blue-600" />}
                text="Foto Kamera"
              />

              {/* Check-in Status */}
              <StatusRow
                icon={<Clock className="h-5 w-5 text-blue-600" />}
                text={
                  checkedOut
                    ? "Sudah cek keluar"
                    : checkedIn
                      ? "Sudah cek datang"
                      : "Belum presensi hari ini"
                }
                textClass={
                  checkedIn || checkedOut
                    ? "text-green-700"
                    : "text-muted-foreground"
                }
              />
            </CardContent>
          </Card>

          {/* Location Info Link */}
          <button
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
            onClick={() => setLocationInfoOpen(true)}
          >
            <Info className="h-3.5 w-3.5" />
            Dimana saya bisa melakukan presensi?
          </button>

          {/* Date & Time */}
          <div className="py-2 text-center">
            <p className="text-sm text-muted-foreground">
              {formatIndonesianDate(currentTime)}
            </p>
            <p className="mt-1 text-4xl font-bold tabular-nums tracking-tight text-gray-900">
              {formatTime(currentTime)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleCheckIn}
              disabled={checkedIn || !userLocation}
              className="h-12 gap-2 bg-green-600 text-base font-semibold shadow-md hover:bg-green-700 disabled:bg-green-300 disabled:shadow-none"
            >
              <LogIn className="h-5 w-5" />
              Cek Datang
            </Button>
            <Button
              onClick={handleCheckOut}
              disabled={!checkedIn || checkedOut || !userLocation}
              className="h-12 gap-2 bg-red-600 text-base font-semibold shadow-md hover:bg-red-700 disabled:bg-red-300 disabled:shadow-none"
            >
              <LogOut className="h-5 w-5" />
              Cek Keluar
            </Button>
          </div>

          {/* View Log Link */}
          <div className="text-center">
            <button
              onClick={() => setLogOpen(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Lihat Log
            </button>
          </div>

          {/* Map */}
          <div className="h-64 overflow-hidden rounded-lg border shadow-sm">
            {userLocation ? (
              <AttendanceMap
                lat={userLocation.lat}
                lng={userLocation.lng}
                locationName={nearestLocation?.name}
                radius={nearestLocation?.radius}
                officeLat={nearestLocation?.lat}
                officeLng={nearestLocation?.lng}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-50">
                <div className="text-center text-sm text-muted-foreground">
                  <MapPin className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                  {locationLoading
                    ? "Memuat peta..."
                    : "Aktifkan lokasi untuk melihat peta"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Camera Dialog */}
      <CameraCapture
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handlePhotoCapture}
        type={cameraType}
      />

      {/* Log Dialog */}
      <AttendanceLog open={logOpen} onClose={() => setLogOpen(false)} />

      {/* Location Info Dialog */}
      <Dialog
        open={locationInfoOpen}
        onOpenChange={(isOpen) => !isOpen && setLocationInfoOpen(false)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Lokasi Presensi</DialogTitle>
            <DialogDescription>
              Daftar lokasi yang tersedia untuk presensi
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {ATTENDANCE_LOCATIONS.map((loc) => (
              <div
                key={loc.name}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{loc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Radius {loc.radius}m dari titik pusat
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Status row sub-component
function StatusRow({
  icon,
  text,
  textClass,
  loading,
}: {
  icon: React.ReactNode;
  text: string;
  textClass?: string;
  loading?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <span className={`text-sm ${textClass || ""} ${loading ? "animate-pulse" : ""}`}>
        {text}
      </span>
    </div>
  );
}

// Beranda (Home) tab content
function BerandaContent({
  user,
  todayRecords,
}: {
  user: UserProfile;
  todayRecords: AttendanceRecord[];
}) {
  const checkIn = todayRecords.find((r) => r.type === "check-in");
  const checkOut = todayRecords.find((r) => r.type === "check-out");

  return (
    <div className="space-y-4 bg-white p-4">
      {/* Welcome */}
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-md">
        <p className="text-sm text-blue-100">Selamat Datang,</p>
        <h1 className="text-lg font-bold">{user.name}</h1>
        <p className="mt-1 text-sm text-blue-200">
          {user.shift} ({user.shiftStart} - {user.shiftEnd})
        </p>
      </div>

      {/* Today's Summary */}
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-3 font-semibold text-gray-900">Rekap Hari Ini</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-green-100 bg-green-50 p-3 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <LogIn className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground">Cek Datang</p>
              <p className="text-lg font-bold text-green-700">
                {checkIn
                  ? new Date(checkIn.timestamp).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                  : "--:--"}
              </p>
            </div>
            <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <LogOut className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-xs text-muted-foreground">Cek Keluar</p>
              <p className="text-lg font-bold text-red-700">
                {checkOut
                  ? new Date(checkOut.timestamp).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                  : "--:--"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shift Info */}
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-3 font-semibold text-gray-900">Informasi Shift</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between rounded-md bg-gray-50 px-3 py-2">
              <span className="text-muted-foreground">Shift</span>
              <span className="font-medium">{user.shift}</span>
            </div>
            <div className="flex justify-between rounded-md bg-gray-50 px-3 py-2">
              <span className="text-muted-foreground">Jam Masuk</span>
              <span className="font-medium">{user.shiftStart}</span>
            </div>
            <div className="flex justify-between rounded-md bg-gray-50 px-3 py-2">
              <span className="text-muted-foreground">Jam Keluar</span>
              <span className="font-medium">{user.shiftEnd}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Locations */}
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-3 font-semibold text-gray-900">Lokasi Presensi</h3>
          <div className="space-y-2">
            {ATTENDANCE_LOCATIONS.map((loc) => (
              <div
                key={loc.name}
                className="flex items-center gap-3 rounded-md bg-gray-50 px-3 py-2 text-sm"
              >
                <MapPin className="h-4 w-4 shrink-0 text-blue-600" />
                <span className="font-medium">{loc.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  radius {loc.radius}m
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
