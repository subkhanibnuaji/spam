"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getMonthName } from "@/lib/attendance";

interface MonthPickerProps {
  open: boolean;
  onClose: () => void;
  selectedYear: number;
  selectedMonth: number;
  onSelect: (year: number, month: number) => void;
}

export function MonthPicker({
  open,
  onClose,
  selectedYear,
  selectedMonth,
  onSelect,
}: MonthPickerProps) {
  const [year, setYear] = useState(selectedYear);

  // Reset year when opening
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setYear(selectedYear);
    } else {
      onClose();
    }
  };

  const handleSelect = (month: number) => {
    onSelect(year, month);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Pilih Bulan</DialogTitle>
          <DialogDescription>
            Pilih bulan dan tahun untuk ditampilkan
          </DialogDescription>
        </DialogHeader>

        {/* Year navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setYear((y) => y - 1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-lg font-bold">{year}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setYear((y) => y + 1)}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Month grid */}
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 12 }, (_, i) => {
            const isSelected = year === selectedYear && i === selectedMonth;
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {getMonthName(i).slice(0, 3)}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
