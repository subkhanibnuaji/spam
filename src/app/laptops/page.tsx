"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Filter, Info, Laptop, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LaptopCard } from "@/components/laptops/laptop-card";
import { LaptopFilter } from "@/components/laptops/laptop-filter";
import { GPUPerformanceChart } from "@/components/laptops/gpu-performance-chart";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { laptopsData, gpusData, tiersData } from "./data";
import { formatPrice } from "@/lib/utils";

interface FilterState {
  tiers: string[];
  brands: string[];
  gpus: string[];
  priceRange: [number, number];
  gta6Ready: boolean;
  vram8gb: boolean;
  recommendedOnly: boolean;
}

export default function LaptopsPage() {
  const [filters, setFilters] = useState<FilterState>({
    tiers: [],
    brands: [],
    gpus: [],
    priceRange: [10000000, 40000000],
    gta6Ready: false,
    vram8gb: false,
    recommendedOnly: false,
  });

  const filteredLaptops = useMemo(() => {
    return laptopsData.filter((laptop) => {
      // Price filter
      if (laptop.priceUsedMin && laptop.priceUsedMin < filters.priceRange[0]) return false;
      if (laptop.priceUsedMax && laptop.priceUsedMax > filters.priceRange[1]) return false;

      // Tier filter
      if (filters.tiers.length > 0 && !filters.tiers.includes(laptop.tier.slug)) return false;

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(laptop.brand)) return false;

      // GPU filter
      if (filters.gpus.length > 0 && !filters.gpus.includes(laptop.gpu.name)) return false;

      // GTA 6 Ready filter
      if (filters.gta6Ready && !["bagus", "sangat_bagus"].includes(laptop.gpu.gta6Ready)) {
        return false;
      }

      // VRAM 8GB filter
      if (filters.vram8gb && laptop.gpu.vram < 8) return false;

      // Recommended only
      if (filters.recommendedOnly && !laptop.isRecommended && !laptop.isValueKing) return false;

      return true;
    });
  }, [filters]);

  const availableFilters = useMemo(() => {
    const tiers = tiersData.map((tier) => ({
      id: tier.slug,
      name: tier.name,
      count: laptopsData.filter((l) => l.tier.slug === tier.slug).length,
    }));

    const brands = Array.from(new Set(laptopsData.map((l) => l.brand))).map(
      (brand) => ({
        name: brand,
        count: laptopsData.filter((l) => l.brand === brand).length,
      })
    );

    const gpus = Array.from(new Set(laptopsData.map((l) => l.gpu.name))).map(
      (gpu) => ({
        name: gpu,
        count: laptopsData.filter((l) => l.gpu.name === gpu).length,
      })
    );

    return { tiers, brands, gpus };
  }, []);

  const stats = useMemo(() => {
    const total = filteredLaptops.length;
    const gta6Ready = filteredLaptops.filter(
      (l) => ["bagus", "sangat_bagus"].includes(l.gpu.gta6Ready)
    ).length;
    const avgPrice =
      filteredLaptops.reduce(
        (acc, l) => acc + (l.priceUsedMin || 0),
        0
      ) / (total || 1);

    return { total, gta6Ready, avgPrice };
  }, [filteredLaptops]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium text-primary">Gaming Laptop Guide</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              Laptop Gaming Bekas Terbaik
              <span className="text-primary block">untuk GTA 5 & GTA 6</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Panduan lengkap memilih laptop gaming bekas di Jakarta. Dari budget Rp 13 juta 
              hingga Rp 35 juta, dengan analisis kesiapan GTA 6 dan value terbaik.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 bg-background/80 px-3 py-1.5 rounded-full">
                <Laptop className="w-4 h-4 text-primary" />
                <span>15 Laptop Terkurasi</span>
              </div>
              <div className="flex items-center gap-2 bg-background/80 px-3 py-1.5 rounded-full">
                <Filter className="w-4 h-4 text-primary" />
                <span>4 Tier Budget</span>
              </div>
              <div className="flex items-center gap-2 bg-background/80 px-3 py-1.5 rounded-full">
                <ShoppingBag className="w-4 h-4 text-primary" />
                <span>Update 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          <aside className="lg:w-64 flex-shrink-0">
            <LaptopFilter
              filters={filters}
              onFilterChange={setFilters}
              availableFilters={availableFilters}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Menampilkan</p>
                  <p className="text-2xl font-bold">{stats.total} Laptop</p>
                </div>
                <div className="hidden sm:block h-10 w-px bg-border" />
                <div className="hidden sm:block">
                  <p className="text-sm text-muted-foreground">Siap GTA 6</p>
                  <p className="text-2xl font-bold text-green-600">{stats.gta6Ready}</p>
                </div>
                <div className="hidden sm:block h-10 w-px bg-border" />
                <div className="hidden md:block">
                  <p className="text-sm text-muted-foreground">Harga Rata-rata</p>
                  <p className="text-2xl font-bold">{formatPrice(Math.round(stats.avgPrice))}</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="grid" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="tiers">Per Tier</TabsTrigger>
                  <TabsTrigger value="gpu">Performa GPU</TabsTrigger>
                </TabsList>
              </div>

              {/* Grid View */}
              <TabsContent value="grid" className="space-y-6">
                {filteredLaptops.length === 0 ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Tidak ada laptop yang sesuai dengan filter. Coba ubah filter Anda.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredLaptops.map((laptop, index) => (
                      <motion.div
                        key={laptop.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <LaptopCard laptop={laptop} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Tier View */}
              <TabsContent value="tiers" className="space-y-8">
                {tiersData.map((tier) => {
                  const tierLaptops = filteredLaptops.filter(
                    (l) => l.tier.slug === tier.slug
                  );
                  if (tierLaptops.length === 0) return null;

                  return (
                    <div key={tier.slug} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold">{tier.name}</h2>
                          <p className="text-sm text-muted-foreground">
                            {tier.description}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-primary">
                          {formatPrice(tier.minBudget)} - {formatPrice(tier.maxBudget)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tierLaptops.map((laptop) => (
                          <LaptopCard key={laptop.id} laptop={laptop} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </TabsContent>

              {/* GPU Performance View */}
              <TabsContent value="gpu">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <GPUPerformanceChart gpus={gpusData} />
                  <div className="space-y-6">
                    <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
                      <h3 className="font-semibold text-amber-900 mb-2">
                        🎮 GTA 6 Requirements
                      </h3>
                      <ul className="space-y-2 text-sm text-amber-800">
                        <li>• Minimum: RTX 3060 / RX 6600 (8GB VRAM)</li>
                        <li>• Recommended: RTX 4070 / RX 7800 XT</li>
                        <li>• RAM: 16GB minimum, 32GB ideal</li>
                        <li>• Storage: 150GB NVMe SSD (wajib)</li>
                        <li>• DLSS/FSR: Wajib untuk performa optimal</li>
                      </ul>
                    </div>
                    <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">
                        ✅ Sweet Spot 2026
                      </h3>
                      <p className="text-sm text-green-800 mb-2">
                        <strong>RTX 3070 Laptop (2021)</strong> adalah value terbaik:
                      </p>
                      <ul className="space-y-1 text-sm text-green-800">
                        <li>• Harga bekas: Rp 17-22 juta</li>
                        <li>• VRAM 8GB cukup untuk GTA 6</li>
                        <li>• Depresiasi 40-45% dari harga baru</li>
                        <li>• Masih dapat driver update penuh</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}
