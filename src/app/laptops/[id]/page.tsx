"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Cpu, 
  Gauge, 
  HardDrive, 
  Monitor, 
  CheckCircle2,
  XCircle,
  MapPin,
  ShoppingBag,
  ThumbsUp,
  ThumbsDown,
  Award,
  Crown,
  BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LaptopTierBadge } from "@/components/laptops/laptop-tier-badge";
import { GTA6ReadinessBadge } from "@/components/laptops/gta6-readiness-badge";
import { Progress } from "@/components/ui/progress";
import { laptopsData } from "../data";
import { formatPrice } from "@/lib/utils";

export default function LaptopDetailPage() {
  const params = useParams();
  const laptop = laptopsData.find((l) => l.id === params.id);

  if (!laptop) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertTitle>Laptop tidak ditemukan</AlertTitle>
          <AlertDescription>
            Laptop yang Anda cari tidak ada dalam database kami.
          </AlertDescription>
        </Alert>
        <Link href="/laptops" className="mt-4 inline-block">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Laptop
          </Button>
        </Link>
      </div>
    );
  }

  const getBadgeIcon = () => {
    if (laptop.isValueKing) return <Crown className="w-6 h-6 text-amber-500" />;
    if (laptop.isRecommended) return <BadgeCheck className="w-6 h-6 text-blue-500" />;
    if (laptop.badge) return <Award className="w-6 h-6 text-purple-500" />;
    return null;
  };

  const savings = laptop.priceNewMin && laptop.priceUsedMin
    ? laptop.priceNewMin - laptop.priceUsedMin
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/laptops" className="hover:text-primary">Laptops</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{laptop.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/laptops">
            <Button variant="ghost" className="mb-4 -ml-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <LaptopTierBadge tier={laptop.tier.slug} />
                {getBadgeIcon()}
                {laptop.badge && (
                  <Badge variant="secondary">{laptop.badge}</Badge>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold">{laptop.name}</h1>
              <p className="text-lg text-muted-foreground mt-2">
                {laptop.brand} {laptop.series} • {laptop.year}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <Cpu className="w-8 h-8 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Processor</p>
                  <p className="font-semibold">{laptop.cpuModel}</p>
                  <p className="text-xs text-muted-foreground">{laptop.cpuCores}-core/{laptop.cpuThreads}-thread</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Gauge className="w-8 h-8 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Graphics</p>
                  <p className="font-semibold">{laptop.gpu.name}</p>
                  <p className="text-xs text-muted-foreground">{laptop.gpu.vram}GB VRAM</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <HardDrive className="w-8 h-8 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Memory</p>
                  <p className="font-semibold">{laptop.ramSize}GB {laptop.ramType}</p>
                  <p className="text-xs text-muted-foreground">{laptop.storageSize}GB {laptop.storageType}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Monitor className="w-8 h-8 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Display</p>
                  <p className="font-semibold">{laptop.screenSize?.toFixed(1) || "15.6"}&quot;</p>
                  <p className="text-xs text-muted-foreground">{laptop.screenResolution} {laptop.refreshRate}Hz</p>
                </CardContent>
              </Card>
            </div>

            {/* GTA 6 Readiness */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-primary" />
                  Kesiapan Gaming
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status GTA 6</p>
                    <GTA6ReadinessBadge 
                      readiness={laptop.gpu.gta6Ready} 
                      score={laptop.gta6Readiness || undefined}
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">GTA 5 Rating</p>
                    <div className="flex items-center gap-2">
                      <Progress value={laptop.gta5Rating || 0} className="w-24" />
                      <span className="font-semibold">{laptop.gta5Rating}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{laptop.gpu.gta5Ultra1080p}</p>
                    <p className="text-xs text-muted-foreground">GTA 5 Ultra 1080p</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{laptop.gpu.vram}GB</p>
                    <p className="text-xs text-muted-foreground">VRAM</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{laptop.gpuWattage}W</p>
                    <p className="text-xs text-muted-foreground">TGP GPU</p>
                  </div>
                </div>

                {laptop.gpu.dlssVersion && (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>DLSS {laptop.gpu.dlssVersion} Tersedia</AlertTitle>
                    <AlertDescription>
                      Laptop ini mendukung DLSS {laptop.gpu.dlssVersion} untuk performa lebih baik di game yang mendukung.
                      {laptop.gpu.dlssVersion === "3.0" && " Frame Generation dapat menggandakan FPS."}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Deskripsi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {laptop.description}
                </p>
              </CardContent>
            </Card>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <ThumbsUp className="w-5 h-5" />
                    Kelebihan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {laptop.pros?.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <ThumbsDown className="w-5 h-5" />
                    Kekurangan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {laptop.cons?.map((con, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{con}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Verdict */}
            <Alert className="bg-primary/5 border-primary/20">
              <Award className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary">Verdict</AlertTitle>
              <AlertDescription className="text-foreground">
                {laptop.verdict}
              </AlertDescription>
            </Alert>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="border-primary">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-lg">Harga Bekas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">
                    {formatPrice(laptop.priceUsedMin || 0)}
                    <span className="text-lg text-muted-foreground"> - </span>
                    {formatPrice(laptop.priceUsedMax || 0)}
                  </p>
                </div>

                {laptop.priceNewMin && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Harga Baru:</span>
                        <span className="line-through">
                          {formatPrice(laptop.priceNewMin)} - {formatPrice(laptop.priceNewMax || laptop.priceNewMin)}
                        </span>
                      </div>
                      {savings && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Hemat:</span>
                          <span className="text-green-600 font-medium">
                            {formatPrice(savings)} ({laptop.depreciationPercent}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {laptop.valueScore && (
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-1">Value Score</p>
                    <div className="flex items-center gap-2">
                      <Progress value={laptop.valueScore} className="flex-1" />
                      <span className="font-bold">{laptop.valueScore}/100</span>
                    </div>
                  </div>
                )}

                <Button className="w-full" size="lg">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Cari di Marketplace
                </Button>
              </CardContent>
            </Card>

            {/* Specs Detail */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Spesifikasi Lengkap</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Berat</span>
                  <span className="font-medium">{laptop.weight} kg</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Material</span>
                  <span className="font-medium">{laptop.buildMaterial}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Panel</span>
                  <span className="font-medium">{laptop.panelType}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Kecerahan</span>
                  <span className="font-medium">{laptop.screenBrightness} nits</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Cooling</span>
                  <span className="font-medium">{laptop.coolingSolution}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">MUX Switch</span>
                  <span className="font-medium">{laptop.hasMuxSwitch ? "Ya" : "Tidak"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Service Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Info Service Jakarta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Service Center</span>
                  <span className="font-medium">{laptop.serviceCenterCountJakarta} lokasi</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Ketersediaan Sparepart</span>
                  <span className="font-medium capitalize">{laptop.sparePartAvailability}</span>
                </div>
                {laptop.commonIssues && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTitle className="text-sm">Catatan Penting</AlertTitle>
                    <AlertDescription className="text-xs">
                      {laptop.commonIssues}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
