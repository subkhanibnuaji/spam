"use client";

import { CheckCircle2, AlertCircle, XCircle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface GTA6ReadinessBadgeProps {
  readiness: string;
  score?: number;
  className?: string;
}

const readinessConfig: Record<string, { 
  label: string; 
  color: string; 
  bg: string;
  icon: React.ReactNode;
  description: string;
}> = {
  "sangat_bagus": {
    label: "Sangat Siap",
    color: "text-green-700",
    bg: "bg-green-100",
    icon: <Shield className="w-3.5 h-3.5" />,
    description: "GTA 6 akan berjalan lancar di setting Medium-High",
  },
  "bagus": {
    label: "Siap GTA 6",
    color: "text-emerald-700",
    bg: "bg-emerald-100",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    description: "GTA 6 playable di setting Low-Medium",
  },
  "marginal": {
    label: "Bisa GTA 6",
    color: "text-amber-700",
    bg: "bg-amber-100",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    description: "GTA 6 bisa jalan tapi perlu setting Low + DLSS",
  },
  "tidak": {
    label: "Tidak Siap",
    color: "text-red-700",
    bg: "bg-red-100",
    icon: <XCircle className="w-3.5 h-3.5" />,
    description: "VRAM tidak cukup untuk GTA 6",
  },
};

export function GTA6ReadinessBadge({ readiness, score, className }: GTA6ReadinessBadgeProps) {
  const config = readinessConfig[readiness] || readinessConfig["tidak"];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium",
        config.bg,
        config.color,
        className
      )}
      title={config.description}
    >
      {config.icon}
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="ml-1 opacity-75">({score}%)</span>
      )}
    </div>
  );
}
