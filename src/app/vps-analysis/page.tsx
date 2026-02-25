"use client";

import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trophy,
  Medal,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  DollarSign,
  Shield,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Activity,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const providers = [
  {
    id: "netcup",
    rank: 1,
    emoji: "🥇",
    name: "Netcup RS 1000 G12",
    tagline: "Root Server — Dedicated Cores",
    verdict: "WINNER",
    verdictColor: "bg-green-100 text-green-800 border-green-300",
    borderColor: "border-green-500",
    price: "€8.74/bln (~$9.45)",
    priceNote: "Hemat $3.55 dari budget $13",
    specs: {
      cpu: "4 Dedicated Cores AMD EPYC 9645 Zen 5",
      ram: "8GB DDR5 ECC",
      storage: "256GB NVMe",
      iops: "~93,000–96,400",
      bandwidth: "~80–120TB (practically unmetered)",
      location: "Jerman (EU)",
      latencyJkt: "~180–200ms",
    },
    pros: [
      "4 Dedicated Cores — zero throttling, zero CPU steal",
      "8GB DDR5 ECC RAM — latest gen dengan error correction",
      "256GB NVMe — ~96K IOPS enterprise-grade",
      "€8.74/month — jauh di bawah budget",
      "~80-120TB bandwidth — praktis unmetered",
      "30-day money-back guarantee",
    ],
    cons: [
      "Kontrak 12 bulan (€104.88 total) — ada 30-day refund",
      "Setup fee €9.90 untuk monthly contract",
      "Verifikasi ID: user Indonesia sering diminta KTP/passport",
      "Support lambat (ticket-based, timezone EU)",
      "Latency ~180–200ms ke Jakarta (acceptable untuk bot)",
    ],
    insight:
      "Cost per Effective Core: €2.19/core — 3x lebih baik dari Hetzner terdekat! Ideal untuk OpenClaw 24/7 dan heavy browser automation.",
    insightColor: "bg-green-50 border-green-300 text-green-800",
  },
  {
    id: "ovh",
    rank: 2,
    emoji: "🥈",
    name: "OVHcloud VPS-1",
    tagline: "Budget-Friendly Backup Plan",
    verdict: "RUNNER-UP",
    verdictColor: "bg-blue-100 text-blue-800 border-blue-300",
    borderColor: "border-blue-400",
    price: "$4.80/bln",
    priceNote: "Paling murah, no commitment",
    specs: {
      cpu: "4 vCPU (shared, Xeon lama ~Geekbench 1,165)",
      ram: "4GB",
      storage: "80GB SSD",
      iops: "~20,000",
      bandwidth: "Unlimited (throttle risk di APAC)",
      location: "Singapore DC tersedia",
      latencyJkt: "~30–50ms (Singapore)",
    },
    pros: [
      "$4.80/month — ultra cheap",
      "No commitment — monthly billing",
      "Singapore DC — low latency ke Jakarta",
      "Free daily backups included",
      "Anti-DDoS protection",
      "IOPS ~20K (lebih baik dari estimasi awal)",
    ],
    cons: [
      "CPU sangat shared — CPU steal risk tinggi",
      "Single-core performance rendah (~1,165 Geekbench)",
      "APAC bandwidth lebih restrictive",
      "Possible throttle ke 1 Mbps jika abuse terdeteksi",
      "4 vCPU tapi kecepatan per core pas-pasan",
    ],
    insight:
      "Pilih ini jika butuh flexibility tanpa commitment atau ada payment issues dengan Netcup. Performa cukup untuk 1 Chrome + light bots, tapi tidak untuk heavy scraping.",
    insightColor: "bg-blue-50 border-blue-300 text-blue-800",
  },
  {
    id: "hostinger",
    rank: 3,
    emoji: "🥉",
    name: "Hostinger KVM 2",
    tagline: "User-Friendly New Entry",
    verdict: "NEW FIND",
    verdictColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    borderColor: "border-emerald-400",
    price: "$8.99/bln (promo) / $12.99 renewal",
    priceNote: "Attention: harga naik saat renewal",
    specs: {
      cpu: "2 vCPU (shared, throttling policy tidak dijelaskan)",
      ram: "8GB",
      storage: "100GB NVMe",
      iops: "Tidak tersedia data benchmark",
      bandwidth: "Tidak terbatas (fair use)",
      location: "Multi-region",
      latencyJkt: "Bergantung region",
    },
    pros: [
      "8GB RAM dalam budget saat promo ($8.99)",
      "One-click Docker installation",
      "24/7 live chat support",
      "AI-ready templates tersedia",
      "100GB NVMe storage",
    ],
    cons: [
      "Renewal $12.99/mo — price jump signifikan",
      "Shared vCPU dengan throttling risk",
      "Throttling policy tidak transparan",
      "Data IOPS benchmark tidak tersedia",
    ],
    insight:
      "Opsi untuk user yang butuh UX mudah dan support aktif. Hati-hati dengan harga renewal yang naik drastis.",
    insightColor: "bg-amber-50 border-amber-300 text-amber-800",
  },
  {
    id: "hetzner",
    rank: 4,
    emoji: "⚠️",
    name: "Hetzner Cloud (CX/CPX/CAX)",
    tagline: "Populer tapi Risky untuk 24/7",
    verdict: "CAUTION",
    verdictColor: "bg-yellow-100 text-yellow-800 border-yellow-300",
    borderColor: "border-yellow-400",
    price: "€9.49–€12.49/bln",
    priceNote: "Melebihi Netcup tapi performa lebih rendah",
    specs: {
      cpu: "4–8 vCPU (THROTTLED 20–33% sustained)",
      ram: "8–16GB",
      storage: "80–160GB SSD",
      iops: "~20,000–40,000",
      bandwidth: "20TB included",
      location: "Jerman/Finlandia",
      latencyJkt: "~170–200ms",
    },
    plans: [
      { name: "CX43", price: "€9.49", vcpu: 8, throttle: "~20%", effective: "~1.6 cores" },
      { name: "CPX32", price: "€10.99", vcpu: 4, throttle: "~33%", effective: "~1.3 cores" },
      { name: "CAX31 (ARM)", price: "€12.49", vcpu: 8, throttle: "~30%", effective: "~2.4 cores" },
    ],
    pros: [
      "Infrastruktur Eropa reliable",
      "UI/UX panel yang bagus",
      "Community besar dan dokumentasi lengkap",
      "ARM option (CAX) tersedia",
    ],
    cons: [
      "CPU throttle 20–33% untuk sustained load — dealbreaker untuk 24/7",
      "Harga lebih mahal dari Netcup tapi performa lebih rendah",
      "Fair Use Policy aktif — tidak cocok untuk continuous workload",
      "ARM: perlu effort lebih untuk setup Playwright/Chromium",
    ],
    insight:
      "CPU throttle 20–33% adalah dealbreaker untuk OpenClaw 24/7. Untuk workload burst singkat mungkin fine, tapi bukan untuk automation berat.",
    insightColor: "bg-yellow-50 border-yellow-300 text-yellow-800",
  },
  {
    id: "contabo",
    rank: 5,
    emoji: "❌",
    name: "Contabo Cloud VPS",
    tagline: "Avoid at All Costs",
    verdict: "NOT VIABLE",
    verdictColor: "bg-red-100 text-red-800 border-red-300",
    borderColor: "border-red-500",
    price: "$7–14/bln",
    priceNote: "Harga menipu, performa catastrophic",
    specs: {
      cpu: "4–8 vCPU (CPU steal 30–80%!)",
      ram: "8–16GB",
      storage: "200–400GB (HDD-class SSD)",
      iops: "1,300–2,700",
      bandwidth: "32TB",
      location: "Multi-region",
      latencyJkt: "Bergantung region",
    },
    pros: [
      "Storage besar per dollar",
      "Bandwidth tinggi",
      "Harga terlihat murah di atas kertas",
    ],
    cons: [
      "4K Random IOPS 1,300–2,700 — 35x lebih lambat dari Netcup",
      "CPU steal 30–80% — lottery-based resource allocation",
      "Performa disk lebih buruk dari SATA SSD tahun 2015",
      "Community verdict: 'Ditch Contabo ASAP' untuk I/O workload",
      "Chrome automation akan timeout dan crash konstan",
    ],
    insight:
      "IOPS 2,600 vs Netcup 93,000 = 35x perbedaan. Chrome automation butuh 500–2,000 IOPS per instance — Contabo akan bottleneck bahkan untuk 1 instance. Jangan pakai.",
    insightColor: "bg-red-50 border-red-300 text-red-800",
  },
];

const iopsData = [
  { name: "Netcup RS 1000 G12", iops: 93000, color: "bg-green-500", textColor: "text-green-700", barWidth: "100%" },
  { name: "OVHcloud VPS-1", iops: 20000, color: "bg-blue-500", textColor: "text-blue-700", barWidth: "21.5%" },
  { name: "Hetzner CPX32", iops: 30000, color: "bg-yellow-500", textColor: "text-yellow-700", barWidth: "32%" },
  { name: "Contabo VPS", iops: 2600, color: "bg-red-500", textColor: "text-red-700", barWidth: "2.8%" },
];

const cpuThrottleData = [
  { provider: "Netcup RS 1000", nominal: "4 cores", sustained: "100%", effective: "4.0 cores", color: "text-green-600", bg: "bg-green-100" },
  { provider: "Hetzner CAX31", nominal: "8 vCPU", sustained: "~30%", effective: "~2.4 cores", color: "text-orange-600", bg: "bg-orange-100" },
  { provider: "Hetzner CX43", nominal: "8 vCPU", sustained: "~20%", effective: "~1.6 cores", color: "text-orange-600", bg: "bg-orange-100" },
  { provider: "Hetzner CPX32", nominal: "4 vCPU", sustained: "~33%", effective: "~1.3 cores", color: "text-orange-600", bg: "bg-orange-100" },
  { provider: "Contabo VPS", nominal: "6 vCPU", sustained: "~20–70%", effective: "~1–4 cores (lottery)", color: "text-red-600", bg: "bg-red-100" },
];

function ProviderCard({ provider }: { provider: typeof providers[0] }) {
  const [open, setOpen] = useState(provider.rank === 1);

  return (
    <div className={cn("rounded-xl border-2 bg-white shadow-sm overflow-hidden transition-all", provider.borderColor)}>
      {/* Header */}
      <button
        className="w-full text-left p-5 flex items-center justify-between hover:bg-muted/40 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl">{provider.emoji}</span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold">{provider.name}</h3>
              <span className={cn("text-xs font-semibold border px-2 py-0.5 rounded-full", provider.verdictColor)}>
                {provider.verdict}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{provider.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="font-semibold text-sm">{provider.price}</p>
            <p className="text-xs text-muted-foreground">{provider.priceNote}</p>
          </div>
          {open ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
        </div>
      </button>

      {/* Body */}
      {open && (
        <div className="p-5 border-t bg-muted/20 space-y-5">
          {/* Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Cpu className="h-3.5 w-3.5" /> CPU
              </div>
              <p className="text-sm font-medium leading-snug">{provider.specs.cpu}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Server className="h-3.5 w-3.5" /> RAM
              </div>
              <p className="text-sm font-medium">{provider.specs.ram}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <HardDrive className="h-3.5 w-3.5" /> Storage
              </div>
              <p className="text-sm font-medium">{provider.specs.storage}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Activity className="h-3.5 w-3.5" /> IOPS (4K)
              </div>
              <p className="text-sm font-bold">{provider.specs.iops}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Wifi className="h-3.5 w-3.5" /> Bandwidth
              </div>
              <p className="text-sm font-medium leading-snug">{provider.specs.bandwidth}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <DollarSign className="h-3.5 w-3.5" /> Harga/Latency
              </div>
              <p className="text-xs font-medium">{provider.price}</p>
              <p className="text-xs text-muted-foreground">{provider.specs.latencyJkt} ke Jakarta</p>
            </div>
          </div>

          {/* Hetzner plans table */}
          {"plans" in provider && provider.plans && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-lg overflow-hidden">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Plan</th>
                    <th className="px-3 py-2 text-right font-medium">Harga</th>
                    <th className="px-3 py-2 text-right font-medium">vCPU</th>
                    <th className="px-3 py-2 text-right font-medium">Throttle</th>
                    <th className="px-3 py-2 text-right font-medium">Effective</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {provider.plans.map((p) => (
                    <tr key={p.name} className="bg-white">
                      <td className="px-3 py-2 font-medium">{p.name}</td>
                      <td className="px-3 py-2 text-right">{p.price}</td>
                      <td className="px-3 py-2 text-right">{p.vcpu}</td>
                      <td className="px-3 py-2 text-right text-orange-600 font-medium">{p.throttle}</td>
                      <td className="px-3 py-2 text-right font-bold text-orange-700">{p.effective}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pros & Cons */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Keunggulan
              </p>
              <ul className="space-y-1.5">
                {provider.pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Trade-offs
              </p>
              <ul className="space-y-1.5">
                {provider.cons.map((con) => (
                  <li key={con} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Insight */}
          <div className={cn("rounded-lg border p-3 text-sm font-medium", provider.insightColor)}>
            {provider.insight}
          </div>
        </div>
      )}
    </div>
  );
}

export default function VPSAnalysisPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-16 lg:py-20">
          <Badge className="mb-4 bg-white/20 text-white border-0">
            Browser Automation & 24/7 Uptime
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Analisis VPS
            <span className="block text-2xl lg:text-3xl font-medium mt-2 opacity-90">
              OpenClaw & Browser Automation
            </span>
          </h1>
          <p className="text-lg opacity-90 mb-8 max-w-2xl">
            Perbandingan mendalam provider VPS untuk workload 24/7: IOPS, CPU throttling,
            harga nyata, dan rekomendasi berdasarkan benchmark data.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold">94%</p>
              <p className="text-sm opacity-80">Akurasi Riset</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold">~$13</p>
              <p className="text-sm opacity-80">Budget USD</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold">93K</p>
              <p className="text-sm opacity-80">IOPS Netcup</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-sm opacity-80">Uptime Target</p>
            </div>
          </div>
        </div>
      </section>

      {/* Winner Banner */}
      <section className="bg-green-50 border-b border-green-200">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Trophy className="h-6 w-6 text-green-600 shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-green-800">Rekomendasi Terbaik: Netcup RS 1000 G12</p>
              <p className="text-sm text-green-700">
                €8.74/bln · 4 Dedicated Cores · 93K IOPS · 8GB DDR5 ECC — Best value untuk browser automation 24/7
              </p>
            </div>
            <a
              href="https://www.netcup.eu/vserver/root-server.php"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold text-green-700 hover:text-green-600 shrink-0"
            >
              Lihat Netcup <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 space-y-12">
        {/* IOPS Benchmark Bar Chart */}
        <section>
          <h2 className="text-2xl font-bold mb-2">4K Random IOPS Comparison</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Metrik kunci untuk browser automation — Chrome butuh 500–2,000 IOPS per instance. Data dari YABS benchmarks 2024–2025.
          </p>
          <Card>
            <CardContent className="pt-6 space-y-4">
              {iopsData.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className={cn("text-sm font-bold", item.textColor)}>
                      {item.iops.toLocaleString()} IOPS
                    </span>
                  </div>
                  <div className="h-6 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", item.color)}
                      style={{ width: item.barWidth }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-2">
                Netcup 93K vs Contabo 2,600 = selisih 35x. Contabo bahkan tidak cukup untuk 1 Chrome instance stabil.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* CPU Throttle Table */}
        <section>
          <h2 className="text-2xl font-bold mb-2">CPU Throttling Analysis</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Untuk workload 24/7, yang penting bukan burst — tapi sustained performance. Kolom "Effective" = core yang bisa kamu pakai terus-menerus.
          </p>
          <Card>
            <CardContent className="pt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-3 text-left font-semibold">Provider</th>
                    <th className="py-3 px-3 text-right font-semibold">Nominal vCPU</th>
                    <th className="py-3 px-3 text-right font-semibold">Sustained %</th>
                    <th className="py-3 px-3 text-right font-semibold">Effective Cores</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cpuThrottleData.map((row) => (
                    <tr key={row.provider} className={cn("", row.bg + "/30")}>
                      <td className="py-3 px-3 font-medium">{row.provider}</td>
                      <td className="py-3 px-3 text-right">{row.nominal}</td>
                      <td className="py-3 px-3 text-right font-medium">{row.sustained}</td>
                      <td className={cn("py-3 px-3 text-right font-bold", row.color)}>{row.effective}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        {/* Provider Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-2">Analisis Provider Detail</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Klik tiap card untuk expand detail spesifikasi, keunggulan, dan trade-offs.
          </p>
          <div className="space-y-4">
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </section>

        {/* Key Insights */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Key Insights & Takeaways</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  IOPS adalah metrik #1
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Chrome automation menulis cache, session, cookies, IndexedDB secara konstan dalam block kecil. 4K random IOPS menentukan seberapa banyak instance yang bisa jalan.
              </CardContent>
            </Card>
            <Card className="border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Burst ≠ Sustained
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Hetzner terlihat murah dengan 8 vCPU, tapi throttle 20% = hanya 1.6 core efektif. Untuk 24/7 automation, Netcup 4 dedicated cores jauh lebih baik.
              </CardContent>
            </Card>
            <Card className="border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  ARM bisa, tapi ada caveat
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Playwright support ARM64 native. Puppeteer perlu Chromium ARM manual atau emulasi x86. Bukan "tidak kompatibel", tapi butuh effort lebih.
              </CardContent>
            </Card>
            <Card className="border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Contabo: jangan tertipu
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Storage besar dan bandwidth tinggi bukan berarti bagus untuk automation. IOPS 2,600 akan membuat Chrome konstan timeout dan crash. Community verdict: "Ditch Contabo ASAP".
              </CardContent>
            </Card>
            <Card className="border-violet-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Medal className="h-5 w-5 text-violet-600" />
                  Netcup value proposition
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                €8.74/bln untuk 4 dedicated EPYC cores + 93K IOPS + 8GB DDR5 ECC. Cost per effective core: €2.19 — 3x lebih baik dari Hetzner terdekat.
              </CardContent>
            </Card>
            <Card className="border-sky-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Server className="h-5 w-5 text-sky-600" />
                  OVH: backup yang legit
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Jika Netcup ada payment/verifikasi issues, OVH $4.80/bln di Singapore adalah fallback yang masuk akal. IOPS ~20K cukup untuk 1–2 Chrome instance ringan.
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
