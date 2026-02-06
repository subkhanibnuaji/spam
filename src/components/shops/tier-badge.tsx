import { TIER_CONFIG, type TierKey } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TierBadgeProps {
  tier: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const sizeClasses = {
  sm: "text-xs px-2 py-0",
  md: "text-sm px-2.5 py-0.5",
  lg: "text-base px-3 py-1",
};

export function TierBadge({ tier, size = "md", showLabel = true }: TierBadgeProps) {
  const config = TIER_CONFIG[tier as TierKey];

  if (!config) {
    return (
      <Badge variant="outline" className={sizeClasses[size]}>
        Tier {tier}
      </Badge>
    );
  }

  return (
    <Badge
      className={cn(
        "border-transparent",
        config.bg,
        config.text,
        sizeClasses[size]
      )}
    >
      <span className="font-bold">{tier}</span>
      {showLabel && <span className="ml-1.5 font-normal">{config.label}</span>}
    </Badge>
  );
}
