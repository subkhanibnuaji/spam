"use client";

import { useState } from "react";
import {
  LogIn,
  LogOut,
  MapPin,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  type AttendanceRecord,
  getAttendanceRecords,
  formatIndonesianDate,
} from "@/lib/attendance";

interface AttendanceLogProps {
  open: boolean;
  onClose: () => void;
}

export function AttendanceLog({ open, onClose }: AttendanceLogProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const records = open ? getAttendanceRecords() : [];

  // Group by date
  const grouped = records.reduce<Record<string, AttendanceRecord[]>>(
    (acc, record) => {
      if (!acc[record.date]) acc[record.date] = [];
      acc[record.date].push(record);
      return acc;
    },
    {}
  );

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-h-[80vh] max-w-md overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Log Presensi</DialogTitle>
            <DialogDescription>Riwayat presensi Anda</DialogDescription>
          </DialogHeader>

          {records.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Belum ada riwayat presensi
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(grouped).map(([date, dayRecords]) => (
                <div key={date}>
                  <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
                    {formatIndonesianDate(new Date(date + "T00:00:00"))}
                  </h4>
                  <div className="space-y-2">
                    {dayRecords.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-start gap-3 rounded-lg border p-3"
                      >
                        <div
                          className={`mt-0.5 rounded-full p-1.5 ${
                            record.type === "check-in"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {record.type === "check-in" ? (
                            <LogIn className="h-4 w-4" />
                          ) : (
                            <LogOut className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {record.type === "check-in"
                                ? "Cek Datang"
                                : "Cek Keluar"}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {new Date(record.timestamp).toLocaleTimeString(
                                "id-ID",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: false,
                                }
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {record.location.name}
                            {record.withinArea ? (
                              <span className="ml-1 text-green-600">
                                (Dalam area)
                              </span>
                            ) : (
                              <span className="ml-1 text-red-600">
                                (Luar area)
                              </span>
                            )}
                          </div>
                          {record.photo && (
                            <button
                              onClick={() => setSelectedPhoto(record.photo!)}
                              className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                            >
                              <ImageIcon className="h-3 w-3" />
                              Lihat Foto
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Photo viewer dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Foto Presensi</DialogTitle>
            <DialogDescription>
              Foto yang diambil saat presensi
            </DialogDescription>
          </DialogHeader>
          {selectedPhoto && (
            <img
              src={selectedPhoto}
              alt="Foto presensi"
              className="w-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
