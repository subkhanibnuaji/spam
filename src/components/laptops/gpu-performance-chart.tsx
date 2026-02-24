"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GPU {
  name: string;
  vram: number;
  timeSpyScore: number | null;
  gta5Ultra1080p: string | null;
  gta6Ready: string;
  dlssVersion: string | null;
}

interface GPUPerformanceChartProps {
  gpus: GPU[];
}

export function GPUPerformanceChart({ gpus }: GPUPerformanceChartProps) {
  const sortedGpus = [...gpus].sort((a, b) => 
    (b.timeSpyScore || 0) - (a.timeSpyScore || 0)
  );

  const maxScore = Math.max(...sortedGpus.map(g => g.timeSpyScore || 0));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Performa GPU Laptop</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedGpus.map((gpu) => {
          const percentage = maxScore > 0 
            ? ((gpu.timeSpyScore || 0) / maxScore) * 100 
            : 0;
          
          const gta6Color = {
            "sangat_bagus": "bg-green-500",
            "bagus": "bg-emerald-500",
            "marginal": "bg-amber-500",
            "tidak": "bg-red-500",
          }[gpu.gta6Ready] || "bg-gray-500";

          return (
            <div key={gpu.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{gpu.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {gpu.vram}GB VRAM
                  </span>
                  {gpu.dlssVersion && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                      DLSS {gpu.dlssVersion}
                    </span>
                  )}
                </div>
                <span className="font-mono text-sm">
                  {gpu.timeSpyScore?.toLocaleString() || "N/A"}
                </span>
              </div>
              <div className="relative">
                <Progress value={percentage} className="h-2" />
                <div 
                  className={`absolute right-0 top-0 w-2 h-2 rounded-full ${gta6Color} -mt-0.5`}
                  title={`GTA 6: ${gpu.gta6Ready}`}
                />
              </div>
              {gpu.gta5Ultra1080p && (
                <p className="text-xs text-muted-foreground">
                  GTA 5 Ultra 1080p: {gpu.gta5Ultra1080p}
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
