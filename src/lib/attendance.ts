export interface AttendanceLocation {
  name: string;
  lat: number;
  lng: number;
  radius: number; // meters
}

export interface AttendanceRecord {
  id: string;
  date: string;
  type: "check-in" | "check-out";
  timestamp: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  photo?: string;
  withinArea: boolean;
}

export interface UserProfile {
  name: string;
  position: string;
  shift: string;
  shiftStart: string;
  shiftEnd: string;
}

// Default office locations for attendance
export const ATTENDANCE_LOCATIONS: AttendanceLocation[] = [
  {
    name: "Raden Patah",
    lat: -6.9837,
    lng: 110.4093,
    radius: 200,
  },
  {
    name: "Kantor Pusat",
    lat: -6.2088,
    lng: 106.8456,
    radius: 200,
  },
];

export const DEFAULT_USER: UserProfile = {
  name: "Subkhan Ibnu Aji, S.Kom.",
  position: "Staff IT",
  shift: "Non Shift",
  shiftStart: "07:30",
  shiftEnd: "16:00",
};

const STORAGE_KEY = "attendance_records";
const USER_KEY = "attendance_user";

export function getAttendanceRecords(): AttendanceRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveAttendanceRecord(record: AttendanceRecord): void {
  const records = getAttendanceRecords();
  records.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function getTodayRecords(): AttendanceRecord[] {
  const today = new Date().toISOString().split("T")[0];
  return getAttendanceRecords().filter((r) => r.date === today);
}

export function hasCheckedInToday(): boolean {
  return getTodayRecords().some((r) => r.type === "check-in");
}

export function hasCheckedOutToday(): boolean {
  return getTodayRecords().some((r) => r.type === "check-out");
}

export function getUserProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_USER;
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
  }
}

export function getDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findNearestLocation(
  lat: number,
  lng: number
): { location: AttendanceLocation; distance: number } | null {
  let nearest: { location: AttendanceLocation; distance: number } | null = null;

  for (const loc of ATTENDANCE_LOCATIONS) {
    const distance = getDistanceMeters(lat, lng, loc.lat, loc.lng);
    if (!nearest || distance < nearest.distance) {
      nearest = { location: loc, distance };
    }
  }

  return nearest;
}

export function formatIndonesianDate(date: Date): string {
  const days = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
