// ===== Types =====

export type AttendanceStatus =
  | "WFO"
  | "WFH"
  | "Tidak Hadir"
  | "Cuti"
  | "Sakit"
  | "Dinas";

export interface TimeEntry {
  time: string | null; // "07:38" or null
  badge: string; // "Normal", "Flexi", "TL 3", "PSW 4", "Belum Presensi"
  badgeColor: "green" | "red" | "gray";
}

export interface AttendanceDay {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  datang: TimeEntry;
  pulang: TimeEntry;
}

// ===== Constants =====

const DAYS_ID = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const MONTHS_ID = [
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

// ===== Date helpers =====

export function getDayName(date: Date): string {
  return DAYS_ID[date.getDay()];
}

export function getMonthName(month: number): string {
  return MONTHS_ID[month];
}

export function formatDateDisplay(date: Date): string {
  return `${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${date.getFullYear()}`;
}

function getTodayStr(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

// ===== Badge computation =====

export function computeDatangEntry(
  time: string | null,
  status: AttendanceStatus
): TimeEntry {
  if (
    status === "Tidak Hadir" ||
    status === "Cuti" ||
    status === "Sakit"
  ) {
    return { time: null, badge: "TL 3", badgeColor: "red" };
  }
  if (!time) {
    return { time: null, badge: "Belum Presensi", badgeColor: "gray" };
  }
  const [h, m] = time.split(":").map(Number);
  const minutes = h * 60 + m;
  const shiftStart = 7 * 60 + 30; // 07:30
  if (minutes <= shiftStart) {
    return { time, badge: "Normal", badgeColor: "green" };
  }
  return { time, badge: "Flexi", badgeColor: "green" };
}

export function computePulangEntry(
  time: string | null,
  status: AttendanceStatus
): TimeEntry {
  if (
    status === "Tidak Hadir" ||
    status === "Cuti" ||
    status === "Sakit"
  ) {
    return { time: null, badge: "PSW 4", badgeColor: "red" };
  }
  if (!time) {
    return { time: null, badge: "Belum Presensi", badgeColor: "gray" };
  }
  return { time, badge: "Normal", badgeColor: "green" };
}

// ===== Editability check (within last 2 months) =====

export function isEditable(dateStr: string): boolean {
  const date = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  return date >= twoMonthsAgo && date <= now;
}

// ===== Storage =====

const STORAGE_KEY = "presensi_data_v2";

export function getAllAttendanceData(): Record<string, AttendanceDay> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllAttendanceData(data: Record<string, AttendanceDay>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function saveAttendanceDay(day: AttendanceDay): void {
  const data = getAllAttendanceData();
  data[day.date] = day;
  saveAllAttendanceData(data);
}

export function getMonthAttendance(
  year: number,
  month: number
): AttendanceDay[] {
  const data = getAllAttendanceData();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = getTodayStr();
  const result: AttendanceDay[] = [];

  for (let d = daysInMonth; d >= 1; d--) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (dateStr > todayStr) continue;
    if (data[dateStr]) {
      result.push(data[dateStr]);
    }
  }

  return result;
}

// ===== Seed data matching the screenshots =====

interface SeedEntry {
  status: AttendanceStatus;
  datang: string | null;
  pulang: string | null;
}

const SEED: Record<string, SeedEntry> = {
  // Februari 2026
  "2026-02-12": { status: "WFO", datang: "07:38", pulang: null },
  "2026-02-11": { status: "WFO", datang: "07:26", pulang: "16:02" },
  "2026-02-10": { status: "WFO", datang: "07:24", pulang: "16:12" },
  "2026-02-09": { status: "WFO", datang: "07:09", pulang: "16:10" },
  "2026-02-08": { status: "Tidak Hadir", datang: null, pulang: null },
  "2026-02-07": { status: "Tidak Hadir", datang: null, pulang: null },
  "2026-02-06": { status: "WFO", datang: "06:59", pulang: "17:18" },
  "2026-02-05": { status: "WFO", datang: "07:33", pulang: "18:04" },
  "2026-02-04": { status: "WFO", datang: "07:19", pulang: "16:05" },
  "2026-02-03": { status: "WFO", datang: "07:25", pulang: "16:26" },
  "2026-02-02": { status: "WFO", datang: "07:24", pulang: "16:08" },
  "2026-02-01": { status: "Tidak Hadir", datang: null, pulang: null },
  // Januari 2026
  "2026-01-31": { status: "Tidak Hadir", datang: null, pulang: null },
  "2026-01-30": { status: "WFO", datang: "07:15", pulang: "16:20" },
  "2026-01-29": { status: "WFO", datang: "07:28", pulang: "16:05" },
  "2026-01-28": { status: "WFO", datang: "07:22", pulang: "16:15" },
  "2026-01-27": { status: "WFO", datang: "07:10", pulang: "16:30" },
  "2026-01-26": { status: "WFO", datang: "07:20", pulang: "16:08" },
  "2026-01-25": { status: "Tidak Hadir", datang: null, pulang: null },
  "2026-01-24": { status: "Tidak Hadir", datang: null, pulang: null },
  "2026-01-23": { status: "WFO", datang: "07:31", pulang: "17:00" },
  "2026-01-22": { status: "WFO", datang: "07:18", pulang: "16:10" },
  "2026-01-21": { status: "WFO", datang: "07:25", pulang: "16:22" },
  "2026-01-20": { status: "WFO", datang: "07:12", pulang: "16:05" },
  "2026-01-19": { status: "WFO", datang: "07:08", pulang: "16:18" },
  "2026-01-18": { status: "Tidak Hadir", datang: null, pulang: null },
  "2026-01-17": { status: "Tidak Hadir", datang: null, pulang: null },
  "2026-01-16": { status: "WFO", datang: "07:29", pulang: "16:35" },
  "2026-01-15": { status: "WFO", datang: "07:20", pulang: "16:10" },
  "2026-01-14": { status: "WFO", datang: "07:05", pulang: "16:00" },
  "2026-01-13": { status: "WFO", datang: "07:18", pulang: "16:25" },
  "2026-01-12": { status: "WFO", datang: "07:22", pulang: "16:12" },
  "2026-01-11": { status: "Tidak Hadir", datang: null, pulang: null },
  "2026-01-10": { status: "Tidak Hadir", datang: null, pulang: null },
  "2026-01-09": { status: "WFO", datang: "07:35", pulang: "16:45" },
  "2026-01-08": { status: "WFO", datang: "07:15", pulang: "16:08" },
  "2026-01-07": { status: "WFO", datang: "07:20", pulang: "16:15" },
  "2026-01-06": { status: "WFO", datang: "07:28", pulang: "16:30" },
  "2026-01-05": { status: "WFO", datang: "07:10", pulang: "16:05" },
  "2026-01-04": { status: "Tidak Hadir", datang: null, pulang: null },
  "2026-01-03": { status: "Tidak Hadir", datang: null, pulang: null },
  "2026-01-02": { status: "WFO", datang: "07:22", pulang: "16:18" },
  "2026-01-01": { status: "Tidak Hadir", datang: null, pulang: null },
  // Desember 2025
  "2025-12-31": { status: "WFO", datang: "07:18", pulang: "16:10" },
  "2025-12-30": { status: "WFO", datang: "07:25", pulang: "16:22" },
  "2025-12-29": { status: "WFO", datang: "07:12", pulang: "16:05" },
  "2025-12-28": { status: "Tidak Hadir", datang: null, pulang: null },
  "2025-12-27": { status: "Tidak Hadir", datang: null, pulang: null },
  "2025-12-26": { status: "WFO", datang: "07:20", pulang: "16:15" },
  "2025-12-25": { status: "Tidak Hadir", datang: null, pulang: null },
  "2025-12-24": { status: "WFO", datang: "07:08", pulang: "16:30" },
  "2025-12-23": { status: "WFO", datang: "07:30", pulang: "16:05" },
  "2025-12-22": { status: "WFO", datang: "07:15", pulang: "16:18" },
  "2025-12-21": { status: "Tidak Hadir", datang: null, pulang: null },
  "2025-12-20": { status: "Tidak Hadir", datang: null, pulang: null },
  "2025-12-19": { status: "WFO", datang: "07:22", pulang: "16:25" },
  "2025-12-18": { status: "WFO", datang: "07:28", pulang: "16:10" },
  "2025-12-17": { status: "WFO", datang: "07:05", pulang: "16:35" },
  "2025-12-16": { status: "WFO", datang: "07:18", pulang: "16:08" },
  "2025-12-15": { status: "WFO", datang: "07:10", pulang: "16:20" },
};

export function initializeSeedData(): void {
  if (typeof window === "undefined") return;
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return;

  const data: Record<string, AttendanceDay> = {};

  for (const [dateStr, seed] of Object.entries(SEED)) {
    data[dateStr] = {
      date: dateStr,
      status: seed.status,
      datang: computeDatangEntry(seed.datang, seed.status),
      pulang: computePulangEntry(seed.pulang, seed.status),
    };
  }

  saveAllAttendanceData(data);
}
