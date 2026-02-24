"use client";

import Image from "next/image";
import Link from "next/link";
import { Monitor, Cpu, HardDrive, Gauge, BadgeCheck, Crown, Award } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LaptopTierBadge } from "./laptop-tier-badge";
import { GTA6ReadinessBadge } from "./gta6-readiness-badge";
import { cn, formatPrice } from "@/lib/utils";

interface LaptopCardProps {
  laptop: {
    id: string;
    name: string;
    brand: string;
    model: string;
    year: number;
    cpuModel: string;
    gpu: {
      name: string;
      vram: number;
      gta6Ready: string;
    };
    ramSize: number;
    storageSize: number;
    screenSize: number | null;
    refreshRate: number | null;
    priceUsedMin: number | null;
    priceUsedMax: number | null;
    priceNewMin: number | null;
    priceNewMax: number | null;
    depreciationPercent: number | null;
    tier: {
      slug: string;
    };
    gta5Rating: number | null;
    gta6Readiness: number | null;
    isRecommended?: boolean;
    isValueKing?: boolean;
    badge: string | null;
  };
  className?: string;
}

export function LaptopCard({ laptop, className }: LaptopCardProps) {
  const getBadgeIcon = () => {
    if (laptop.isValueKing) return <Crown className="w-4 h-4 text-amber-500" />;
    if (laptop.isRecommended) return <BadgeCheck className="w-4 h-4 text-blue-500" />;
    if (laptop.badge) return <Award className="w-4 h-4 text-purple-500" />;
    return null;
  };

  const savings = laptop.priceNewMin && laptop.priceUsedMin
    ? Math.round(((laptop.priceNewMin - laptop.priceUsedMin) / laptop.priceNewMin) * 100)
    : null;

  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-300 overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <LaptopTierBadge tier={laptop.tier.slug} />
              {getBadgeIcon()}
            </div>
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {laptop.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {laptop.brand} • {laptop.year}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Cpu className="w-4 h-4" />
            <span className="truncate">{laptop.cpuModel}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gauge className="w-4 h-4" />
            <span>{laptop.gpu.name}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <HardDrive className="w-4 h-4" />
            <span>{laptop.ramSize}GB RAM</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Monitor className="w-4 h-4" />
            <span>
              {laptop.screenSize?.toFixed(1) || "15.6"}&quot; 
              {laptop.refreshRate && `${laptop.refreshRate}Hz`}
            </span>
          </div>
        </div>

        {/* GTA 6 Readiness */}
        <GTA6ReadinessBadge 
          readiness={laptop.gpu.gta6Ready} 
          score={laptop.gta6Readiness || undefined}
        />

        {/* Price Section */}
        <div className="pt-3 border-t">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              {laptop.priceUsedMin ? formatPrice(laptop.priceUsedMin) : "N/A"}
            </span>
            <span className="text-sm text-muted-foreground">-</span>
            <span className="text-lg font-semibold text-primary">
              {laptop.priceUsedMax ? formatPrice(laptop.priceUsedMax) : "N/A"}
            </span>
          </div>
          
          {laptop.priceNewMin && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground line-through">
                Baru: {formatPrice(laptop.priceNewMin)}
              </span>
              {savings && (
                <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                  Hemat {savings}%
                </span>
              )}
            </div>
          )}
        </div>

        {/* CTA */}
        <Link href={`/laptops/${laptop.id}`}>
          <Button className="w-full" variant="default">
            Lihat Detail
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
