"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface FilterState {
  tiers: string[];
  brands: string[];
  gpus: string[];
  priceRange: [number, number];
  gta6Ready: boolean;
  vram8gb: boolean;
  recommendedOnly: boolean;
}

interface LaptopFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableFilters: {
    tiers: { id: string; name: string; count: number }[];
    brands: { name: string; count: number }[];
    gpus: { name: string; count: number }[];
  };
  className?: string;
}

export function LaptopFilter({ 
  filters, 
  onFilterChange, 
  availableFilters,
  className 
}: LaptopFilterProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [isOpen, setIsOpen] = useState(false);

  const applyFilters = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const reset: FilterState = {
      tiers: [],
      brands: [],
      gpus: [],
      priceRange: [10000000, 40000000],
      gta6Ready: false,
      vram8gb: false,
      recommendedOnly: false,
    };
    setLocalFilters(reset);
    onFilterChange(reset);
  };

  const activeFiltersCount = 
    localFilters.tiers.length +
    localFilters.brands.length +
    localFilters.gpus.length +
    (localFilters.gta6Ready ? 1 : 0) +
    (localFilters.vram8gb ? 1 : 0) +
    (localFilters.recommendedOnly ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* GTA 6 Ready Toggle */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">GTA 6 Ready</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="gta6-ready"
              checked={localFilters.gta6Ready}
              onCheckedChange={(checked) =>
                setLocalFilters((f) => ({ ...f, gta6Ready: checked as boolean }))
              }
            />
            <Label htmlFor="gta6-ready" className="text-sm">
              Siap untuk GTA 6
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="vram-8gb"
              checked={localFilters.vram8gb}
              onCheckedChange={(checked) =>
                setLocalFilters((f) => ({ ...f, vram8gb: checked as boolean }))
              }
            />
            <Label htmlFor="vram-8gb" className="text-sm">
              VRAM 8GB+
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="recommended"
              checked={localFilters.recommendedOnly}
              onCheckedChange={(checked) =>
                setLocalFilters((f) => ({ ...f, recommendedOnly: checked as boolean }))
              }
            />
            <Label htmlFor="recommended" className="text-sm">
              Rekomendasi Saja
            </Label>
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Rentang Harga Bekas</h4>
        <Slider
          value={localFilters.priceRange}
          onValueChange={(value) =>
            setLocalFilters((f) => ({ ...f, priceRange: value as [number, number] }))
          }
          min={10000000}
          max={40000000}
          step={1000000}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Rp {(localFilters.priceRange[0] / 1000000).toFixed(0)}jt</span>
          <span>Rp {(localFilters.priceRange[1] / 1000000).toFixed(0)}jt</span>
        </div>
      </div>

      {/* Tiers */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Budget Tier</h4>
        <div className="space-y-2">
          {availableFilters.tiers.map((tier) => (
            <div key={tier.id} className="flex items-center space-x-2">
              <Checkbox
                id={`tier-${tier.id}`}
                checked={localFilters.tiers.includes(tier.id)}
                onCheckedChange={(checked) => {
                  setLocalFilters((f) => ({
                    ...f,
                    tiers: checked
                      ? [...f.tiers, tier.id]
                      : f.tiers.filter((t) => t !== tier.id),
                  }));
                }}
              />
              <Label htmlFor={`tier-${tier.id}`} className="text-sm flex-1">
                {tier.name}
              </Label>
              <span className="text-xs text-muted-foreground">({tier.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Brand</h4>
        <div className="space-y-2">
          {availableFilters.brands.map((brand) => (
            <div key={brand.name} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand.name}`}
                checked={localFilters.brands.includes(brand.name)}
                onCheckedChange={(checked) => {
                  setLocalFilters((f) => ({
                    ...f,
                    brands: checked
                      ? [...f.brands, brand.name]
                      : f.brands.filter((b) => b !== brand.name),
                  }));
                }}
              />
              <Label htmlFor={`brand-${brand.name}`} className="text-sm flex-1">
                {brand.name}
              </Label>
              <span className="text-xs text-muted-foreground">({brand.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* GPUs */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">GPU</h4>
        <div className="space-y-2">
          {availableFilters.gpus.map((gpu) => (
            <div key={gpu.name} className="flex items-center space-x-2">
              <Checkbox
                id={`gpu-${gpu.name}`}
                checked={localFilters.gpus.includes(gpu.name)}
                onCheckedChange={(checked) => {
                  setLocalFilters((f) => ({
                    ...f,
                    gpus: checked
                      ? [...f.gpus, gpu.name]
                      : f.gpus.filter((g) => g !== gpu.name),
                  }));
                }}
              />
              <Label htmlFor={`gpu-${gpu.name}`} className="text-sm flex-1">
                {gpu.name}
              </Label>
              <span className="text-xs text-muted-foreground">({gpu.count})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Desktop Filter */}
      <div className="hidden lg:block w-64 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Filter</h3>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <X className="w-4 h-4 mr-1" />
              Reset ({activeFiltersCount})
            </Button>
          )}
        </div>
        <FilterContent />
        <Button onClick={applyFilters} className="w-full">
          Terapkan Filter
        </Button>
      </div>

      {/* Mobile Filter Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filter
            {activeFiltersCount > 0 && (
              <span className="ml-1 bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              Filter Laptop
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
              )}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
            <Button onClick={applyFilters} className="w-full mt-6">
              Terapkan Filter
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
