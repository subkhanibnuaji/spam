"use client";

import { cn } from "@/lib/utils";

interface LaptopTierBadgeProps {
  tier: string;
  className?: string;
}

const tierConfig: Record<string, { label: string; color: string; bg: string }> = {
  "tier-1-budget": {
    label: "Tier 1: Budget",
    color: "text-emerald-700",
    bg: "bg-emerald-100",
  },
  "tier-2-sweetspot": {
    label: "Tier 2: Sweet Spot",
    color: "text-blue-700",
    bg: "bg-blue-100",
  },
  "tier-3-highend": {
    label: "Tier 3: High-End",
    color: "text-purple-700",
    bg: "bg-purple-100",
  },
  "tier-4-flagship": {
    label: "Tier 4: Flagship",
    color: "text-amber-700",
    bg: "bg-amber-100",
  },
};

export function LaptopTierBadge({ tier, className }: LaptopTierBadgeProps) {
  const config = tierConfig[tier] || {
    label: tier,
    color: "text-gray-700",
    bg: "bg-gray-100",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.bg,
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
