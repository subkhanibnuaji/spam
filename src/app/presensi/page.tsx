"use client";

import { useState, useEffect, useCallback } from "react";
import { CalendarDays, Pencil } from "lucide-react";
import { MonthPicker } from "@/components/presensi/month-picker";
import { EditAttendanceDialog } from "@/components/presensi/edit-attendance-dialog";
import {
  type AttendanceDay,
  getDayName,
  getMonthName,
  formatDateDisplay,
  getMonthAttendance,
  initializeSeedData,
  isEditable,
} from "@/lib/attendance";

export default function PresensiPage() {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(1); // 0-indexed
  const [records, setRecords] = useState<AttendanceDay[]>([]);
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<AttendanceDay | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Initialize seed data on mount
  useEffect(() => {
    initializeSeedData();
    const now = new Date();
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth());
    setReady(true);
  }, []);

  const loadRecords = useCallback(() => {
    if (!ready) return;
    setRecords(getMonthAttendance(selectedYear, selectedMonth));
  }, [selectedYear, selectedMonth, ready]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const handleMonthSelect = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  const handleEditClick = (record: AttendanceDay) => {
    if (isEditable(record.date)) {
      setEditRecord(record);
      setEditOpen(true);
    }
  };

  const handleSave = () => {
    loadRecords();
  };

  if (!ready) return null;

  return (
    <div className="mx-auto max-w-md bg-white min-h-[calc(100vh-4rem)]">
      {/* ===== Header: "Presensi Februari 2026" + calendar icon ===== */}
      <div className="sticky top-16 z-10 flex items-center justify-between border-b bg-white px-4 py-3.5">
        <h1 className="text-[17px] leading-tight">
          <span className="font-bold text-gray-900">Presensi </span>
          <span className="font-bold italic text-teal-600">
            {getMonthName(selectedMonth)} {selectedYear}
          </span>
        </h1>
        <button
          onClick={() => setMonthPickerOpen(true)}
          className="rounded-lg p-1.5 text-teal-600 transition-colors hover:bg-teal-50"
          aria-label="Pilih bulan"
        >
          <CalendarDays className="h-6 w-6" />
        </button>
      </div>

      {/* ===== Records List ===== */}
      <div className="space-y-3 px-4 py-4 pb-8">
        {records.length === 0 ? (
          <div className="py-16 text-center">
            <CalendarDays className="mx-auto mb-3 h-12 w-12 text-gray-200" />
            <p className="text-sm text-gray-400">Belum ada data presensi</p>
          </div>
        ) : (
          records.map((record) => (
            <AttendanceCard
              key={record.date}
              record={record}
              onEditClick={() => handleEditClick(record)}
              editable={isEditable(record.date)}
            />
          ))
        )}
      </div>

      {/* ===== Dialogs ===== */}
      <MonthPicker
        open={monthPickerOpen}
        onClose={() => setMonthPickerOpen(false)}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onSelect={handleMonthSelect}
      />

      <EditAttendanceDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        record={editRecord}
        onSave={handleSave}
      />
    </div>
  );
}

// ===================================================================
// Attendance Card - matches the screenshot design exactly
// ===================================================================

function AttendanceCard({
  record,
  onEditClick,
  editable,
}: {
  record: AttendanceDay;
  onEditClick: () => void;
  editable: boolean;
}) {
  const date = new Date(record.date + "T00:00:00");
  const isAbsent =
    record.status === "Tidak Hadir" ||
    record.status === "Cuti" ||
    record.status === "Sakit";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {/* Row 1: Day name + date (left) | Status badge (right) */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="font-bold text-gray-900">{getDayName(date)} </span>
          <span className="text-sm text-gray-600">
            {formatDateDisplay(date)}
          </span>
        </div>
        <StatusBadge status={record.status} />
      </div>

      {/* Row 2: DATANG | PULANG columns */}
      <div className="grid grid-cols-2 gap-4">
        {/* DATANG */}
        <div>
          <p className="mb-1 text-xs font-bold tracking-wide text-gray-900">
            DATANG
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm tabular-nums text-gray-800">
              {record.datang.time || "--:--"}
            </span>
            <TimeBadge
              badge={record.datang.badge}
              color={record.datang.badgeColor}
            />
          </div>
        </div>

        {/* PULANG */}
        <div>
          <p className="mb-1 text-xs font-bold tracking-wide text-gray-900">
            PULANG
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm tabular-nums text-gray-800">
              {record.pulang.time || "--:--"}
            </span>
            <TimeBadge
              badge={record.pulang.badge}
              color={record.pulang.badgeColor}
            />
          </div>
        </div>
      </div>

      {/* Row 3: Adjustment button for absent days */}
      {isAbsent && editable && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditClick();
            }}
            className="rounded-lg border border-red-400 px-4 py-1.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 active:bg-red-100"
          >
            Adjustment
          </button>
        </div>
      )}

      {/* Edit indicator for editable WFO cards */}
      {!isAbsent && editable && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditClick();
            }}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-teal-600 transition-colors hover:bg-teal-50 active:bg-teal-100"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

// ===================================================================
// Status Badge - "WFO" (dark) or "Tidak Hadir" (red)
// ===================================================================

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    WFO: "bg-gray-800 text-white",
    WFH: "bg-blue-600 text-white",
    Dinas: "bg-indigo-600 text-white",
    Cuti: "bg-amber-500 text-white",
    Sakit: "bg-orange-500 text-white",
    "Tidak Hadir": "bg-red-500 text-white",
  };

  return (
    <span
      className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold ${styles[status] || "bg-gray-500 text-white"}`}
    >
      {status}
    </span>
  );
}

// ===================================================================
// Time Badge - "Normal" (green), "Flexi" (green), "TL 3" (red), etc.
// ===================================================================

function TimeBadge({ badge, color }: { badge: string; color: string }) {
  const colorMap: Record<string, string> = {
    green: "bg-green-600 text-white",
    red: "bg-red-500 text-white",
    gray: "bg-gray-300 text-gray-700",
  };

  return (
    <span
      className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold leading-tight ${colorMap[color] || "bg-gray-300 text-gray-700"}`}
    >
      {badge}
    </span>
  );
}
