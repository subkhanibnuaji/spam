"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  type AttendanceDay,
  type AttendanceStatus,
  computeDatangEntry,
  computePulangEntry,
  getDayName,
  formatDateDisplay,
  saveAttendanceDay,
} from "@/lib/attendance";

interface EditAttendanceDialogProps {
  open: boolean;
  onClose: () => void;
  record: AttendanceDay | null;
  onSave: (updated: AttendanceDay) => void;
}

const STATUS_OPTIONS: { value: AttendanceStatus; label: string }[] = [
  { value: "WFO", label: "WFO" },
  { value: "WFH", label: "WFH" },
  { value: "Dinas", label: "Dinas" },
  { value: "Cuti", label: "Cuti" },
  { value: "Sakit", label: "Sakit" },
  { value: "Tidak Hadir", label: "Tidak Hadir" },
];

export function EditAttendanceDialog({
  open,
  onClose,
  record,
  onSave,
}: EditAttendanceDialogProps) {
  const [status, setStatus] = useState<AttendanceStatus>("WFO");
  const [datangTime, setDatangTime] = useState("");
  const [pulangTime, setPulangTime] = useState("");

  useEffect(() => {
    if (record) {
      setStatus(record.status);
      setDatangTime(record.datang.time || "");
      setPulangTime(record.pulang.time || "");
    }
  }, [record]);

  if (!record) return null;

  const date = new Date(record.date + "T00:00:00");
  const showTimeInputs =
    status === "WFO" || status === "WFH" || status === "Dinas";

  const handleSave = () => {
    const updated: AttendanceDay = {
      date: record.date,
      status,
      datang: computeDatangEntry(
        showTimeInputs && datangTime ? datangTime : null,
        status
      ),
      pulang: computePulangEntry(
        showTimeInputs && pulangTime ? pulangTime : null,
        status
      ),
    };
    saveAttendanceDay(updated);
    onSave(updated);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Presensi</DialogTitle>
          <DialogDescription>
            {getDayName(date)}, {formatDateDisplay(date)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Status selector */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Status Kehadiran
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                    status === opt.value
                      ? "border-teal-600 bg-teal-50 text-teal-700 shadow-sm"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time inputs (only for work statuses) */}
          {showTimeInputs && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Jam Datang
                </label>
                <input
                  type="time"
                  value={datangTime}
                  onChange={(e) => setDatangTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Jam Pulang
                </label>
                <input
                  type="time"
                  value={pulangTime}
                  onChange={(e) => setPulangTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={handleSave}
            className="bg-teal-600 hover:bg-teal-700"
          >
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
