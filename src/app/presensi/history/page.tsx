"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Download, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditAttendanceDialog } from "@/components/presensi/edit-attendance-dialog";
import {
  type AttendanceDay,
  getDayName,
  getMonthName,
  formatDateDisplay,
  getAllAttendanceData,
  initializeSeedData,
  isEditable,
  timeToMinutes,
  minutesToHHMM,
  minutesToTotalHHMM,
  toISODateStr,
} from "@/lib/attendance";

// ===== Constants =====
const SHIFT_START = timeToMinutes("07:30"); // 450
const SHIFT_END = timeToMinutes("16:00"); // 960
const EXPECTED_WORK = 8 * 60; // 480 min

// ===== Types =====
interface HistoryRow {
  no: number;
  date: Date;
  dateStr: string;
  dayName: string;
  location: string;
  jadwal: string;
  masuk: string | null;
  keluar: string | null;
  datangAwal: number;
  terlambat: number;
  pulangAwal: number;
  pulangLebih: number;
  durasi: number;
  detailIn: string;
  detailOut: string;
  isWeekend: boolean;
  attendanceDay: AttendanceDay | null;
}

interface Totals {
  jadwal: number;
  datangAwal: number;
  terlambat: number;
  pulangAwal: number;
  pulangLebih: number;
  durasi: number;
  workDays: number;
  presentDays: number;
}

// ===== Helpers =====
function getSeconds(time: string, dateStr: string): string {
  let hash = 0;
  const str = time + dateStr;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return String(Math.abs(hash) % 50 + 5).padStart(2, "0");
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getDate()} ${getMonthName(d.getMonth()).slice(0, 3)} ${d.getFullYear()}`;
}

function computeRows(
  startDate: string,
  endDate: string,
  data: Record<string, AttendanceDay>
): { rows: HistoryRow[]; totals: Totals } {
  const rows: HistoryRow[] = [];
  const start = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const totals: Totals = {
    jadwal: 0,
    datangAwal: 0,
    terlambat: 0,
    pulangAwal: 0,
    pulangLebih: 0,
    durasi: 0,
    workDays: 0,
    presentDays: 0,
  };

  let no = 0;
  for (
    let d = new Date(end);
    d >= start;
    d.setDate(d.getDate() - 1)
  ) {
    if (d > today) continue;

    no++;
    const dateStr = toISODateStr(d);
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const record = data[dateStr] || null;

    const masuk = record?.datang?.time || null;
    const keluar = record?.pulang?.time || null;
    const isPresent = !!masuk;

    let datangAwal = 0;
    let terlambat = 0;
    let pulangAwal = 0;
    let pulangLebih = 0;
    let durasi = 0;

    // Add jadwal hours for ALL days
    totals.jadwal += SHIFT_END - SHIFT_START; // 510 min per day

    if (masuk) {
      const masukMin = timeToMinutes(masuk);
      if (masukMin < SHIFT_START) {
        datangAwal = SHIFT_START - masukMin;
      }
      // Terlambat only after flexi window (08:00)
      if (masukMin > timeToMinutes("08:00")) {
        terlambat = masukMin - SHIFT_START;
      }
    }

    if (masuk && keluar) {
      const masukMin = timeToMinutes(masuk);
      const keluarMin = timeToMinutes(keluar);
      durasi = keluarMin - masukMin;

      if (keluarMin < SHIFT_END) {
        pulangAwal = SHIFT_END - keluarMin;
      }

      if (durasi > EXPECTED_WORK) {
        pulangLebih = durasi - EXPECTED_WORK;
      }
    }

    // Build detail strings
    let detailIn = "";
    let detailOut = "";
    if (masuk) {
      const sec = getSeconds(masuk, dateStr);
      detailIn = `${masuk}:${sec} Presensi IN via image`;
    }
    if (keluar) {
      const sec = getSeconds(keluar, dateStr);
      detailOut = `${keluar}:${sec} Presensi OUT via image`;
    }

    // Accumulate totals (only for non-weekend with data)
    if (!isWeekend) {
      totals.workDays++;
    }
    if (isPresent) {
      totals.presentDays++;
      totals.datangAwal += datangAwal;
      totals.terlambat += terlambat;
      totals.pulangAwal += pulangAwal;
      totals.pulangLebih += pulangLebih;
      totals.durasi += durasi;
    }

    rows.push({
      no,
      date: new Date(d),
      dateStr,
      dayName: getDayName(new Date(d)),
      location: isPresent && !isWeekend ? "Raden Patah" : "",
      jadwal: "07:30 - 16:00",
      masuk,
      keluar,
      datangAwal,
      terlambat,
      pulangAwal,
      pulangLebih,
      durasi,
      detailIn,
      detailOut,
      isWeekend,
      attendanceDay: record,
    });
  }

  return { rows, totals };
}

// ===== Export CSV =====
function exportCSV(rows: HistoryRow[], totals: Totals) {
  const header = [
    "No",
    "Hari",
    "Tanggal",
    "Masuk",
    "Keluar",
    "Msk",
    "Telat",
    "S",
    "I",
    "TK",
    "D",
    "TL",
    "TB",
    "C",
    "L",
    "HK",
    "WK",
    "Telat",
    "PSW",
    "Pulang Lebih",
    "Pulang Lebih",
    "Keterangan",
  ];

  const csvRows = [
    `"Daftar Histori Presensi Subkhan Ibnu Aji, S.Kom. - 199904242025061007 ${header[0]}","${header.slice(1).join('","')}"`,
  ];

  for (const row of rows) {
    const hasMasuk = !!row.masuk;
    const status = row.attendanceDay?.status || "WFO";
    csvRows.push(
      [
        `"${row.no}"`,
        `"${row.dayName}"`,
        `"${row.dateStr}"`,
        `"${row.masuk || "-"}"`,
        `"${row.keluar || "-"}"`,
        `"${hasMasuk ? "v" : ""}"`,
        `""`,
        `""`,
        `""`,
        `""`,
        `""`,
        `""`,
        `""`,
        `""`,
        `""`,
        `"v"`,
        `"0"`,
        `""`,
        `""`,
        `""`,
        `"0"`,
        `"${status}"`,
      ].join(",")
    );
  }

  // Total row
  csvRows.push(
    [
      `"TOTAL"`,
      `""`,
      `""`,
      `""`,
      `""`,
      `"${totals.presentDays}"`,
      `"0"`,
      `"0"`,
      `"0"`,
      `"0"`,
      `"0"`,
      `"0"`,
      `"0"`,
      `"0"`,
      `"0"`,
      `"${totals.workDays}"`,
      `"0"`,
      `"0"`,
      `"0"`,
      `"0"`,
      `"0"`,
      `""`,
    ].join(",")
  );

  // Legend
  const legend = [
    ["S", "Sakit"],
    ["I", "Izin"],
    ["TK", "Tanpa Keterangan"],
    ["D", "Dinas"],
    ["TL", "Tugas Luar"],
    ["TB", "Tugas Belajar"],
    ["C", "Cuti"],
    ["L", "Libur"],
    ["HK", "Hari Kerja"],
    ["WK", "Waktu Kerja"],
    ["Telat", "Telat"],
    ["PSW", "Pulang Sebelum Waktunya"],
    [
      "Pulang Lebih",
      "Pembulatan kebawah jam lembur setelah dikurangi telat absen",
    ],
  ];
  for (const [code, desc] of legend) {
    csvRows.push(`"${code}","${desc}"${',""'.repeat(20)}`);
  }

  const blob = new Blob([csvRows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Presensi_Subkhan_Ibnu_Aji.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ===== Component =====
export default function HistoryPresensiPage() {
  const [startDate, setStartDate] = useState("2026-01-12");
  const [endDate, setEndDate] = useState("2026-02-12");
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [totals, setTotals] = useState<Totals>({
    jadwal: 0,
    datangAwal: 0,
    terlambat: 0,
    pulangAwal: 0,
    pulangLebih: 0,
    durasi: 0,
    workDays: 0,
    presentDays: 0,
  });
  const [editRecord, setEditRecord] = useState<AttendanceDay | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeSeedData();
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    setStartDate(toISODateStr(oneMonthAgo));
    setEndDate(toISODateStr(now));
    setReady(true);
  }, []);

  const loadData = useCallback(() => {
    if (!ready) return;
    const data = getAllAttendanceData();
    const result = computeRows(startDate, endDate, data);
    setRows(result.rows);
    setTotals(result.totals);
  }, [startDate, endDate, ready]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdjustment = (row: HistoryRow) => {
    if (row.attendanceDay && isEditable(row.dateStr)) {
      setEditRecord(row.attendanceDay);
      setEditOpen(true);
    } else if (isEditable(row.dateStr)) {
      // Create a placeholder record for editing
      setEditRecord({
        date: row.dateStr,
        status: row.isWeekend ? "Tidak Hadir" : "WFO",
        datang: { time: null, badge: "Belum Presensi", badgeColor: "gray" },
        pulang: { time: null, badge: "Belum Presensi", badgeColor: "gray" },
      });
      setEditOpen(true);
    }
  };

  if (!ready) return null;

  const capaian =
    totals.workDays > 0
      ? Math.round((totals.presentDays / totals.workDays) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-7xl bg-white min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
        <Link
          href="/presensi"
          className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
          aria-label="Kembali ke Presensi"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900">Presensi Personal</h1>
      </div>

      {/* Period selector */}
      <div className="px-4 pb-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Periode</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          />
          <span className="text-sm text-gray-500">s/d</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>

        {/* Action buttons */}
        <div className="mt-3 flex gap-2">
          <Button
            onClick={() => exportCSV(rows, totals)}
            className="gap-1.5 bg-red-500 text-sm hover:bg-red-600"
            size="sm"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={loadData}
            className="gap-1.5 bg-teal-600 text-sm hover:bg-teal-700"
            size="sm"
          >
            <Search className="h-4 w-4" />
            Tampilkan
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-4 pb-8 sm:px-6">
        <table className="w-full min-w-[1100px] border-collapse text-sm">
          <thead>
            <tr className="bg-teal-700 text-white">
              <th className="border border-teal-600 px-2 py-2.5 text-center text-xs font-semibold">
                No
              </th>
              <th className="border border-teal-600 px-2 py-2.5 text-left text-xs font-semibold">
                Tanggal
              </th>
              <th className="border border-teal-600 px-2 py-2.5 text-center text-xs font-semibold">
                Jadwal
              </th>
              <th className="border border-teal-600 px-2 py-2.5 text-center text-xs font-semibold">
                Masuk
              </th>
              <th className="border border-teal-600 px-2 py-2.5 text-center text-xs font-semibold">
                Keluar
              </th>
              <th className="border border-teal-600 px-2 py-2.5 text-center text-xs font-semibold">
                Datang
                <br />
                Awal
              </th>
              <th className="border border-teal-600 px-2 py-2.5 text-center text-xs font-semibold">
                Terlambat
              </th>
              <th className="border border-teal-600 px-2 py-2.5 text-center text-xs font-semibold">
                Pulang
                <br />
                Awal
              </th>
              <th className="border border-teal-600 px-2 py-2.5 text-center text-xs font-semibold">
                Pulang
                <br />
                Lebih
              </th>
              <th className="border border-teal-600 px-2 py-2.5 text-center text-xs font-semibold">
                Durasi
              </th>
              <th className="border border-teal-600 px-2 py-2.5 text-left text-xs font-semibold">
                Detail
              </th>
              <th className="border border-teal-600 px-2 py-2.5 text-center text-xs font-semibold">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.dateStr}
                className={
                  row.isWeekend ? "bg-gray-50 text-gray-400" : "bg-white"
                }
              >
                <td className="border border-gray-200 px-2 py-2 text-center text-xs">
                  {row.no}
                </td>
                <td className="border border-gray-200 px-2 py-2 text-xs">
                  <div className="font-semibold text-gray-800">
                    {row.dayName}, {formatDateDisplay(row.date)}
                  </div>
                  {row.location && (
                    <div className="text-[10px] text-teal-600">
                      {row.location}
                    </div>
                  )}
                </td>
                <td className="border border-gray-200 px-2 py-2 text-center text-xs text-gray-600">
                  {row.jadwal}
                </td>
                <td className="border border-gray-200 px-2 py-2 text-center text-xs font-medium">
                  {row.masuk || "-"}
                </td>
                <td className="border border-gray-200 px-2 py-2 text-center text-xs font-medium">
                  {row.keluar || "-"}
                </td>
                <td className="border border-gray-200 px-2 py-2 text-center text-xs text-green-700">
                  {minutesToHHMM(row.datangAwal)}
                </td>
                <td className="border border-gray-200 px-2 py-2 text-center text-xs text-red-600">
                  {minutesToHHMM(row.terlambat)}
                </td>
                <td className="border border-gray-200 px-2 py-2 text-center text-xs text-red-600">
                  {minutesToHHMM(row.pulangAwal)}
                </td>
                <td className="border border-gray-200 px-2 py-2 text-center text-xs text-blue-700">
                  {minutesToHHMM(row.pulangLebih)}
                </td>
                <td className="border border-gray-200 px-2 py-2 text-center text-xs font-medium">
                  {row.durasi > 0 ? minutesToTotalHHMM(row.durasi) : ""}
                </td>
                <td className="border border-gray-200 px-2 py-2 text-[10px] text-gray-500">
                  {row.detailIn && <div>{row.detailIn}</div>}
                  {row.detailOut && <div>{row.detailOut}</div>}
                </td>
                <td className="border border-gray-200 px-2 py-2 text-center">
                  {isEditable(row.dateStr) && (
                    <button
                      onClick={() => handleAdjustment(row)}
                      className="rounded border border-teal-500 px-2 py-1 text-[10px] font-medium text-teal-600 hover:bg-teal-50"
                    >
                      Adjustment
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {/* Total row */}
            <tr className="bg-teal-50 font-semibold">
              <td
                colSpan={2}
                className="border border-gray-200 px-2 py-2.5 text-xs font-bold text-gray-800"
              >
                Total
              </td>
              <td className="border border-gray-200 px-2 py-2.5 text-center text-xs text-gray-700">
                {minutesToTotalHHMM(totals.jadwal)}
              </td>
              <td className="border border-gray-200 px-2 py-2.5" />
              <td className="border border-gray-200 px-2 py-2.5" />
              <td className="border border-gray-200 px-2 py-2.5 text-center text-xs text-green-700">
                {minutesToTotalHHMM(totals.datangAwal)}
              </td>
              <td className="border border-gray-200 px-2 py-2.5 text-center text-xs text-red-600">
                {minutesToTotalHHMM(totals.terlambat)}
              </td>
              <td className="border border-gray-200 px-2 py-2.5 text-center text-xs text-red-600">
                {minutesToTotalHHMM(totals.pulangAwal)}
              </td>
              <td className="border border-gray-200 px-2 py-2.5 text-center text-xs text-blue-700">
                {minutesToTotalHHMM(totals.pulangLebih)}
              </td>
              <td className="border border-gray-200 px-2 py-2.5 text-center text-xs">
                {minutesToTotalHHMM(totals.durasi)}
              </td>
              <td className="border border-gray-200 px-2 py-2.5 text-xs text-teal-700">
                Capaian Presensi {capaian}%
              </td>
              <td className="border border-gray-200 px-2 py-2.5" />
            </tr>
          </tbody>
        </table>
      </div>

      {/* Edit Dialog */}
      <EditAttendanceDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        record={editRecord}
        onSave={loadData}
      />
    </div>
  );
}
