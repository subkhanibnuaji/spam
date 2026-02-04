import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function Loading({ size = "md" }: LoadingProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2
        className={cn("animate-spin text-primary", sizeClasses[size])}
      />
    </div>
  );
}
