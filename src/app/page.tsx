"use client";

import Link from "next/link";
import {
  MapPin,
  Gamepad2,
  Calendar,
  Server,
  ChevronRight,
  Star,
  TrendingDown,
  Cpu,
  Wrench,
  Map,
  Clock,
  Laptop,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { shopsData } from "@/data/shops";
import { clustersData } from "@/data/clusters";
import { laptopsData } from "./laptops/data";

// Stats for Surface Repair
const surfaceStats = {
  total: shopsData.length,
  openNow: Math.floor(shopsData.length * 0.7),
  perfectRating: shopsData.filter(s => s.googleRating === 5).length,
  avgRating: (shopsData.reduce((acc, s) => acc + (s.googleRating || 0), 0) / shopsData.length).toFixed(1),
};

// Stats for Laptops
const laptopStats = {
  total: laptopsData.length,
  gta6Ready: laptopsData.filter(l => ["bagus", "sangat_bagus"].includes(l.gpu.gta6Ready)).length,
  valueKing: laptopsData.filter(l => l.isValueKing).length,
  avgSavings: Math.round(
    laptopsData.reduce((acc, l) => acc + (l.depreciationPercent || 0), 0) / laptopsData.length
  ),
};

// Featured laptops
const featuredLaptops = laptopsData
  .filter(l => l.isRecommended || l.isValueKing)
  .slice(0, 3);

export default function SuperAppPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="container mx-auto px-4 py-16 lg:py-24 relative">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-0">
              v2.0 Super App
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              SPAM
              <span className="block text-2xl lg:text-3xl font-medium mt-2 opacity-90">
                Service Provider And Management
              </span>
            </h1>
            <p className="text-lg lg:text-xl opacity-90 mb-8 leading-relaxed">
              Platform all-in-one untuk service center gadget, laptop gaming bekas, 
              dan manajemen kunjungan di Jakarta.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <p className="text-3xl font-bold">{surfaceStats.total}</p>
                <p className="text-sm opacity-80">Service Center</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <p className="text-3xl font-bold">{laptopStats.total}</p>
                <p className="text-sm opacity-80">Laptop Gaming</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <p className="text-3xl font-bold">6</p>
                <p className="text-sm opacity-80">Layanan Aktif</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <p className="text-3xl font-bold">{laptopStats.gta6Ready}</p>
                <p className="text-sm opacity-80">Siap GTA 6</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Pilih Layanan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Surface Repair Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Wrench className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Surface Repair</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Temukan service center terbaik untuk repair Surface, LCD, dan gadget di Jakarta.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Service Center</span>
                  <span className="font-medium">{surfaceStats.total}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rating Rata-rata</span>
                  <span className="font-medium flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {surfaceStats.avgRating}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cluster Area</span>
                  <span className="font-medium">{clustersData.length}</span>
                </div>
              </div>
              <Link href="/shops">
                <Button className="w-full mt-2 group-hover:bg-blue-600">
                  Cari Service Center
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Gaming Laptops Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl-lg">
              Baru!
            </div>
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Gamepad2 className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Gaming Laptops</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Panduan lengkap laptop gaming bekas untuk GTA 5 & GTA 6 di Jakarta.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Laptop</span>
                  <span className="font-medium">{laptopStats.total}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Siap GTA 6</span>
                  <span className="font-medium text-green-600">{laptopStats.gta6Ready}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Hemat Rata-rata</span>
                  <span className="font-medium text-green-600">
                    <TrendingDown className="w-3 h-3 inline mr-1" />
                    {laptopStats.avgSavings}%
                  </span>
                </div>
              </div>
              <Link href="/laptops">
                <Button className="w-full mt-2 bg-green-600 hover:bg-green-700">
                  Lihat Rekomendasi
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Trip Planner Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                <Map className="w-6 h-6 text-amber-600" />
              </div>
              <CardTitle className="text-xl">Trip Planner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Rencanakan kunjungan ke multiple service center dengan route optimization.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <BadgeCheck className="w-4 h-4 text-green-500" />
                  <span>Route Optimization</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BadgeCheck className="w-4 h-4 text-green-500" />
                  <span>Multi-stop Planning</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BadgeCheck className="w-4 h-4 text-green-500" />
                  <span>Estimasi Waktu</span>
                </div>
              </div>
              <Link href="/trip-planner">
                <Button className="w-full mt-2 bg-amber-600 hover:bg-amber-700">
                  Plan Perjalanan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Attendance Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Presensi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Sistem presensi kunjungan dengan kamera dan geolocation.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <BadgeCheck className="w-4 h-4 text-green-500" />
                  <span>Clock-in/out GPS</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BadgeCheck className="w-4 h-4 text-green-500" />
                  <span>Kamera Capture</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BadgeCheck className="w-4 h-4 text-green-500" />
                  <span>Export CSV</span>
                </div>
              </div>
              <Link href="/presensi">
                <Button className="w-full mt-2 bg-purple-600 hover:bg-purple-700">
                  Buka Presensi
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* VPS Analysis Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-violet-500 text-white text-xs px-2 py-1 rounded-bl-lg">
              Baru!
            </div>
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-violet-200 transition-colors">
                <Server className="w-6 h-6 text-violet-600" />
              </div>
              <CardTitle className="text-xl">VPS Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Perbandingan provider VPS untuk browser automation & workload 24/7.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Provider Dibandingkan</span>
                  <span className="font-medium">5 Provider</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Best IOPS</span>
                  <span className="font-medium text-violet-600 flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    93K (Netcup)
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Budget Target</span>
                  <span className="font-medium">~$13/bln</span>
                </div>
              </div>
              <Link href="/vps-analysis">
                <Button className="w-full mt-2 bg-violet-600 hover:bg-violet-700">
                  Lihat Analisis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* SaaS Material Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-cyan-500 text-white text-xs px-2 py-1 rounded-bl-lg">
              Baru!
            </div>
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-200 transition-colors">
                <BookOpen className="w-6 h-6 text-cyan-600" />
              </div>
              <CardTitle className="text-xl">Materi SaaS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Riset & materi clone SaaS terkurasi: Linear, Notion, Slack, dan 40+ platform.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Platform Terkurasi</span>
                  <span className="font-medium">40+ Platform</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Zona Belajar Terbaik</span>
                  <span className="font-medium text-cyan-600">8-12 minggu</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Format</span>
                  <span className="font-medium">PDF + PPT</span>
                </div>
              </div>
              <Link href="/saas-clone-material">
                <Button className="w-full mt-2 bg-cyan-600 hover:bg-cyan-700">
                  Buka Materi
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Laptops Section */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Laptop Gaming Unggulan</h2>
              <p className="text-muted-foreground">Rekomendasi terbaik untuk GTA 5 & GTA 6</p>
            </div>
            <Link href="/laptops">
              <Button variant="outline">
                Lihat Semua
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredLaptops.map((laptop) => (
              <Card key={laptop.id} className="group hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      variant={laptop.tier.slug === "tier-2-sweetspot" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {laptop.tier.name.split(":")[0]}
                    </Badge>
                    {laptop.badge && (
                      <Badge variant="outline" className="text-xs">
                        {laptop.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{laptop.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Cpu className="w-4 h-4 text-muted-foreground" />
                      <span>{laptop.gpu.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Laptop className="w-4 h-4 text-muted-foreground" />
                      <span>{laptop.ramSize}GB RAM</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {laptop.priceUsedMin ? `Rp ${(laptop.priceUsedMin / 1000000).toFixed(1)}jt` : "N/A"}
                      </p>
                      {laptop.priceNewMin && (
                        <p className="text-sm text-muted-foreground line-through">
                          Rp {(laptop.priceNewMin / 1000000).toFixed(1)}jt
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">GTA 6</p>
                      <p className={`font-medium ${
                        ["bagus", "sangat_bagus"].includes(laptop.gpu.gta6Ready) 
                          ? "text-green-600" 
                          : "text-amber-600"
                      }`}>
                        {["bagus", "sangat_bagus"].includes(laptop.gpu.gta6Ready) ? "Siap" : "Bisa"}
                      </p>
                    </div>
                  </div>

                  <Link href={`/laptops/${laptop.id}`}>
                    <Button variant="outline" className="w-full">
                      Lihat Detail
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Akses Cepat</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link href="/shops">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <MapPin className="w-7 h-7 text-primary mb-2" />
                <p className="font-medium text-sm">Service Center</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/laptops">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Gamepad2 className="w-7 h-7 text-green-600 mb-2" />
                <p className="font-medium text-sm">Laptop Gaming</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/trip-planner">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Map className="w-7 h-7 text-amber-600 mb-2" />
                <p className="font-medium text-sm">Trip Planner</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/presensi">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Clock className="w-7 h-7 text-purple-600 mb-2" />
                <p className="font-medium text-sm">Presensi</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/vps-analysis">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Server className="w-7 h-7 text-violet-600 mb-2" />
                <p className="font-medium text-sm">VPS Analysis</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/saas-clone-material">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <BookOpen className="w-7 h-7 text-cyan-600 mb-2" />
                <p className="font-medium text-sm">Materi SaaS</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <Separator className="mb-8" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg">SPAM</h3>
              <p className="text-sm text-muted-foreground">
                Service Provider And Management
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <Link href="/shops" className="hover:text-primary">Service Center</Link>
              <Link href="/laptops" className="hover:text-primary">Laptop Gaming</Link>
              <Link href="/trip-planner" className="hover:text-primary">Trip Planner</Link>
              <Link href="/presensi" className="hover:text-primary">Presensi</Link>
              <Link href="/vps-analysis" className="hover:text-primary">VPS Analysis</Link>
              <Link href="/saas-clone-material" className="hover:text-primary">Materi SaaS</Link>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            © 2026 SPAM - All rights reserved. Data terakhir update: Februari 2026.
          </p>
        </div>
      </footer>
    </div>
  );
}
