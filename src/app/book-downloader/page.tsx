"use client";

import { useState } from "react";
import {
  BookOpen,
  Globe,
  Download,
  Gift,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronUp,
  Laptop,
  Smartphone,
  Apple,
  Terminal,
  Lock,
  Wifi,
  Server,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Domain data
const domains = [
  {
    tier: "Portal Pusat",
    url: "https://z-lib.id/",
    status: "active",
    note: "Konsolidasi resmi terpusat era 2025/2026. Sistem DNS failover. Sangat sulit disensor.",
  },
  {
    tier: "Mirror Andalan",
    url: "https://z-library.sk/",
    status: "active",
    note: "Domain andalan dari Slowakia. Prioritas rujukan tinggi.",
  },
  {
    tier: "Mirror Alternatif",
    url: "https://1lib.sk/",
    status: "active",
    note: "Load-balanced endpoint. Sinkronisasi sempurna dengan server utama.",
  },
  {
    tier: "Mirror Alternatif",
    url: "https://z-lib.fm/",
    status: "active",
    note: "Titik muat seimbang. Digunakan taktis jika portal utama diblokir.",
  },
  {
    tier: "Mirror Alternatif",
    url: "https://z-lib.gd/",
    status: "active",
    note: "Mirror cadangan untuk wilayah dengan regulasi ketat.",
  },
  {
    tier: "Mirror Alternatif",
    url: "https://z-lib.gl/",
    status: "active",
    note: "Mirror regional untuk akses yang lebih stabil.",
  },
  {
    tier: "Regional Eropa",
    url: "https://z-lib.fo/",
    status: "active",
    note: "Rute bypass spesifik untuk Italia, Prancis, dan Spanyol.",
  },
  {
    tier: "Tor Network",
    url: "http://bookszlibb74ugqojhzhg2a63w5i2atv5bqarulgczawnbmsb6s6qead.onion",
    status: "secure",
    note: "Cawan suci privasi. Membutuhkan Tor Browser. Tidak dapat disensor.",
  },
];

// Desktop apps
const desktopApps = [
  {
    os: "Windows",
    icon: Laptop,
    version: "v3.1.0",
    size: "152.78 MB",
    type: "Installer",
    sha256: "6cd063864ec4ac03dab0d8329ac4c7c6aed1dc54d4eb7401f88cd4c1c42f198c",
    note: "Windows 10+. Juga tersedia versi Portable (109 MB).",
  },
  {
    os: "macOS",
    icon: Apple,
    version: "v2.1.2",
    size: "121.53 MB",
    type: "DMG",
    sha256: null,
    note: "macOS Big Sur (11.0) atau lebih baru.",
  },
  {
    os: "Linux Debian/Ubuntu",
    icon: Terminal,
    version: "v3.1.0",
    size: "164.79 MB",
    type: ".deb",
    sha256: null,
    note: "Install: sudo dpkg -i zlibrary.deb",
  },
  {
    os: "Linux Fedora/RHEL",
    icon: Terminal,
    version: "v0.99.4",
    size: "112 MB",
    type: ".rpm",
    sha256: null,
    note: "Install: sudo dnf install zlibrary.rpm",
  },
  {
    os: "Linux Universal",
    icon: Terminal,
    version: "v3.1.0",
    size: "197 MB",
    type: "AppImage",
    sha256: null,
    note: "Jalankan tanpa instalasi. Set executable permission.",
  },
  {
    os: "Android",
    icon: Smartphone,
    version: "v1.11.4",
    size: "Variable",
    type: ".apk",
    sha256: null,
    note: "Download manual .apk. Tidak tersedia di Play Store.",
  },
];

// Methods data
const methods = [
  {
    priority: 1,
    title: "Aplikasi Desktop",
    bonus: "1 Bulan Premium + 20/hari permanen",
    description: "Bonus tertinggi & permanen. Download dari portal resmi.",
    details: [
      "Bonus 1 bulan Premium: 999 unduhan/hari",
      "Setelah promo: 20 unduhan/hari permanen (2x dari web)",
      "Kecepatan tidak dibatasi (no throttle)",
      "Koneksi anti-pemblokiran via Tor di background",
    ],
    cta: "Download di go-to-library.sk",
    ctaUrl: "https://go-to-library.sk/#desktop_app_tab",
  },
  {
    priority: 2,
    title: "Share Promotion",
    bonus: "X2 Daily Limit",
    description: "Bagikan ke sosial media untuk mendapatkan kuota tambahan.",
    details: [
      "Muncul saat limit tercapai (10 buku)",
      "Klik tombol 'Share Z-Library'",
      "Bagikan ke X/Twitter, Facebook, atau Reddit",
      "Kuota langsung bertambah setelah sharing",
    ],
    cta: null,
    ctaUrl: null,
  },
  {
    priority: 3,
    title: "Gift / Unwrap it",
    bonus: "+5 hingga +15 unduhan",
    description: "Cari easter egg di banner homepage saat event.",
    details: [
      "Cari banner 'Gift inside' di homepage",
      "Klik tombol 'Gift inside'",
      "Scroll ke footer cari ikon tersembunyi",
      "Hover dan klik 'Unwrap it!' untuk dapatkan kode",
    ],
    cta: "Lihat panduan detail di bawah",
    ctaUrl: null,
  },
  {
    priority: 4,
    title: "Telegram Bot",
    bonus: "+10 unduhan/hari",
    description: "Hubungkan akun ke bot Telegram pribadi.",
    details: [
      "Buat akun baru (dapat Premium 2 minggu)",
      "Buka panel Z-Access di pengaturan",
      "Generate Personal Telegram Bot",
      "Aktifkan bot untuk +10 unduhan/hari",
    ],
    cta: null,
    ctaUrl: null,
  },
];

// Promo codes
const promoCodes = [
  {
    code: "ZLIBGIFT4U",
    status: "active",
    bonus: "+5 unduhan/hari",
    duration: "14 hari",
    expiry: "Segera redeem - menuju akhir periode",
    context: "Kode apresiasi peluncuran fitur 'My Library'",
  },
  {
    code: "ZLIBNEWYEAR25",
    status: "expired",
    bonus: "Premium 31 hari",
    duration: "Expired",
    expiry: "31 Januari 2025",
    context: "Kode tahunan 2025",
  },
];

// Scam warnings
const scamWarnings = [
  {
    title: '"Lifetime Premium Membership"',
    icon: AlertTriangle,
    severity: "high",
    description: "Email massal mengklaim Z-Library akan jadi 'Closed System' dan menawarkan slot terbatas Lifetime Premium.",
    fact: "Z-Library TIDAK PERNAH menawarkan paket Lifetime. Model mereka non-profit berbasis donasi.",
  },
  {
    title: "Azteco Coin Extortion",
    icon: Lock,
    severity: "high",
    description: "Mirror palsu meminta transfer kripto 'Azteco Coins' ($40-80) untuk 'membuka' download.",
    fact: "Setelah membayar, situs meminta transfer lagi. Z-Library TIDAK PERNAH meminta pembayaran untuk download.",
  },
  {
    title: "Typo-Squatting Domain",
    icon: Globe,
    severity: "medium",
    description: "Domain mirip tanpa strip: zlib.io, zlib.id, z-lib.xyz, z-library.cc, zlib-downloader.com",
    fact: "Portal resmi hanya z-lib.id (dengan strip). Domain lain berpotensi mencuri kredensial.",
  },
];

// Collapsible section component
function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
      >
        <h3 className="font-semibold">{title}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
        )}
      </button>
      {isOpen && <div className="p-4 pt-0 border-t">{children}</div>}
    </div>
  );
}

// Copy button component
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors ml-2"
    >
      {copied ? (
        <>
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          <span className="text-green-500">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

export default function BookDownloaderPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800 text-white">
        <div className="container mx-auto px-4 py-16 lg:py-20">
          <Badge className="mb-4 bg-white/20 text-white border-0">
            <BookOpen className="h-3 w-3 mr-1" />
            Research Guide 2026
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Z-Library & Annas Archive
            <span className="block text-2xl lg:text-3xl font-medium mt-2 opacity-90">
              Book Downloader Complete Guide
            </span>
          </h1>
          <p className="text-lg opacity-90 mb-8 max-w-2xl">
            Panduan lengkap akses Z-Library: status domain terbaru, metode bypass limit,
            promo code aktif, dan proteksi dari scam. Update Februari 2026.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold">999</p>
              <p className="text-sm opacity-80">Download/Hari (Premium)</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold">8+</p>
              <p className="text-sm opacity-80">Domain Resmi</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold">6</p>
              <p className="text-sm opacity-80">Platform OS</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold">100%</p>
              <p className="text-sm opacity-80">Akses Tor</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Banner */}
      <section className="bg-emerald-50 border-b border-emerald-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Globe className="h-5 w-5 text-emerald-600 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-emerald-800">Domain Utama Aktif:</p>
              <p className="text-sm text-emerald-700">
                https://z-lib.id/ (Portal Konsolidasi) · https://z-library.sk/ (Mirror Andalan)
              </p>
            </div>
            <a
              href="https://z-lib.id/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-600 shrink-0"
            >
              Buka Z-Library <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <div className="container mx-auto px-4 py-10">
        <Tabs defaultValue="status" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 h-auto">
            <TabsTrigger value="status" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Status</span>
            </TabsTrigger>
            <TabsTrigger value="methods" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Metode</span>
            </TabsTrigger>
            <TabsTrigger value="desktop" className="flex items-center gap-2">
              <Laptop className="h-4 w-4" />
              <span className="hidden sm:inline">Desktop App</span>
            </TabsTrigger>
            <TabsTrigger value="promo" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              <span className="hidden sm:inline">Promo Code</span>
            </TabsTrigger>
            <TabsTrigger value="domains" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span className="hidden sm:inline">Domain</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Keamanan</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Status Situs */}
          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-emerald-600" />
                  Status Situs Saat Ini (Februari 2026)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">AKTIF & BERFUNGSI PENUH</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Domain <strong>https://z-library.sk/</strong> saat ini adalah mirror paling tangguh dan stabil.
                    Domain Slowakia (.sk) ini telah terbukti bertahan di tengah gelombang penutupan situs.
                  </p>
                </div>

                <CollapsibleSection title="Evolusi Infrastruktur 2025-2026" defaultOpen={true}>
                  <div className="space-y-4 text-sm">
                    <p>
                      Setelah penyitaan domain bersejarah pada 2025, Z-Library mengimplementasikan
                      <strong> strategi konsolidasi domain absolut</strong>:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>
                          <strong>Portal Gerbang Utama:</strong> https://z-lib.id/ - Konsolidasi resmi
                          dengan mesin verifikasi anti-bot dan mitigasi DDoS.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>
                          <strong>Redundansi Server:</strong> Klaster server geografis dengan failover DNS otomatis.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>
                          <strong>Domain Personal:</strong> URL unik per akun setelah login,
                          membuat pemblokiran massal tidak efisien.
                        </span>
                      </li>
                    </ul>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Alternatif Mirror Jika Downtime">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium mb-1">Pintu Masuk Global</p>
                      <a href="https://z-lib.id/" target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline break-all">
                        https://z-lib.id/
                      </a>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium mb-1">Mirror Eropa Timur</p>
                      <a href="https://z-library.sk/" target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline break-all">
                        https://z-library.sk/
                      </a>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium mb-1">Jaringan Mirror</p>
                      <p className="text-sm text-muted-foreground">
                        1lib.sk · z-lib.fm · z-lib.gd · z-lib.gl
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium mb-1">Tor Network</p>
                      <p className="text-xs text-muted-foreground break-all">
                        bookszlibb74ugqojhzhg2a63w5i2atv5bqarulgczawnbmsb6s6qead.onion
                      </p>
                    </div>
                  </div>
                </CollapsibleSection>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  <p className="font-medium text-blue-800 mb-1">💡 Tips DNS</p>
                  <p className="text-blue-700">
                    Jika mengalami "Connection Timed Out" atau "DNS_PROBE_FINISHED_NXDOMAIN",
                    ubah DNS ke <strong>Cloudflare 1.1.1.1</strong> atau <strong>Google 8.8.8.8</strong>.
                    80% kasus "Z-Library down" sebenarnya hanya pemblokiran DNS lokal.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Metode */}
          <TabsContent value="methods" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-emerald-600" />
                  Metode Terbaik & Paling Ampuh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">
                  Z-Library menggunakan model freemium. Tamu: 5 download/hari.
                  Akun gratis: 10 download/hari (dibatasi 1 MB/s).
                  Berikut metode legal untuk meningkatkan limit:
                </p>

                <div className="space-y-4">
                  {methods.map((method) => (
                    <div
                      key={method.priority}
                      className={cn(
                        "border-2 rounded-xl overflow-hidden",
                        method.priority === 1 ? "border-emerald-500 bg-emerald-50/30" : "border-border"
                      )}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                              method.priority === 1 ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                            )}>
                              {method.priority}
                            </div>
                            <div>
                              <h3 className="font-semibold">{method.title}</h3>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                            </div>
                          </div>
                          <Badge variant={method.priority === 1 ? "default" : "secondary"} className="shrink-0">
                            {method.bonus}
                          </Badge>
                        </div>

                        <div className="mt-4 ml-11">
                          <ul className="space-y-1.5">
                            {method.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                          {method.cta && (
                            <a
                              href={method.ctaUrl || "#"}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary hover:underline"
                            >
                              {method.cta} <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step by Step Guide */}
            <Card>
              <CardHeader>
                <CardTitle>Step-by-Step Guide SUPER DETAIL</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CollapsibleSection title="Panduan Instalasi Desktop App (Multi-OS)" defaultOpen={true}>
                  <div className="space-y-4 text-sm">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="font-medium text-amber-800">⚠️ Peringatan Keamanan</p>
                      <p className="text-amber-700">
                        Download HANYA dari https://go-to-library.sk/#desktop_app_tab.
                        Jangan cari via Google - hasil pencarian sering dipenuhi malware.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Windows (10+)</h4>
                      <ul className="space-y-1 ml-4">
                        <li>• Pilih Installer (153 MB) untuk integrasi penuh, atau Portable (109 MB) untuk USB</li>
                        <li>• SHA256: 6cd063864ec4ac03dab0d8329ac4c7c6aed1dc54d4eb7401f88cd4c1c42f198c</li>
                        <li>• Jalankan setup.exe dan ikuti wizard instalasi</li>
                      </ul>

                      <h4 className="font-medium">macOS (Big Sur 11.0+)</h4>
                      <ul className="space-y-1 ml-4">
                        <li>• Download .dmg (121.53 MB)</li>
                        <li>• Double-click .dmg, drag Z-Library ke folder Applications</li>
                        <li>• Jika muncul peringatan Gatekeeper: System Preferences → Security & Privacy → Open Anyway</li>
                      </ul>

                      <h4 className="font-medium">Linux</h4>
                      <ul className="space-y-1 ml-4">
                        <li>• <strong>Debian/Ubuntu:</strong> sudo dpkg -i zlibrary.deb</li>
                        <li>• <strong>Fedora/RHEL:</strong> sudo dnf install zlibrary.rpm</li>
                        <li>• <strong>Universal:</strong> Download AppImage, chmod +x, lalu double-click</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="font-medium text-green-800">🎉 Momen Klaim Premium</p>
                      <p className="text-green-700">
                        Setelah login di aplikasi desktop, modal akan muncul: &quot;Welcome to Desktop App!
                        As a little bonus, users who access the library through the desktop app will receive
                        a 1-month Premium membership!&quot;. Limit Anda akan berubah dari 10 menjadi 999 unduhan/hari.
                      </p>
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Panduan 'Share the Library' Promotion">
                  <div className="space-y-3 text-sm">
                    <ol className="space-y-2 ml-4">
                      <li><strong>1. Pemicu:</strong> Saat unduhan ke-11 ditolak, layar overlay muncul dengan teks &quot;Limit Reached&quot;</li>
                      <li><strong>2. Identifikasi Tombol:</strong> Cari tombol berwarna mencolok bertuliskan &quot;Share Z-Library&quot; atau &quot;Get X2 Daily Limit&quot;</li>
                      <li><strong>3. Pilih Platform:</strong> Klik logo X/Twitter, Facebook, atau Reddit</li>
                      <li><strong>4. Publish:</strong> Sistem akan membuat draft post - publish untuk verifikasi</li>
                      <li><strong>5. Kuota Aktif:</strong> Dalam hitungan milidetik, kuota akan bertambah secara instan</li>
                    </ol>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Panduan 'Gift / Unwrap it' Easter Egg">
                  <div className="space-y-3 text-sm">
                    <p>
                      Fitur ini muncul saat event (Tahun Baru, ulang tahun Z-Library, kampanye donasi).
                      Mencakup elemen gamifikasi perburuan harta karun.
                    </p>
                    <ol className="space-y-2 ml-4">
                      <li><strong>1.</strong> Cari banner di homepage dengan teks &quot;Premium Membership + X2 Daily Limit&quot;</li>
                      <li><strong>2.</strong> Perhatikan logo OS (Windows, Mac, Linux/Tux) di banner</li>
                      <li><strong>3.</strong> Di sudut banner, klik tombol &quot;Gift inside&quot;</li>
                      <li><strong>4.</strong> Scroll ke footer halaman</li>
                      <li><strong>5.</strong> Cari ilustrasi tersembunyi (kereta salju, perahu, atau kotak kado)</li>
                      <li><strong>6.</strong> Hover kursor di atas ilustrasi hingga muncul &quot;Unwrap it!&quot;</li>
                      <li><strong>7.</strong> Klik untuk membuka pop-up dengan kode promo (contoh: ZLIBGIFT4U)</li>
                    </ol>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Cara Redeem Promo Code">
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="font-medium text-red-800">⚠️ Perhatian</p>
                      <p className="text-red-700">
                        Modul redeem berada di halaman Donasi - bukan di pengaturan akun.
                        Banyak kode kedaluwarsa karena pengguna tidak menemukan lokasi redeem.
                      </p>
                    </div>
                    <ol className="space-y-2 ml-4">
                      <li><strong>1.</strong> Login ke akun Z-Library Anda</li>
                      <li><strong>2.</strong> Klik menu Profile → &quot;Donate&quot; atau &quot;Premium&quot; (tombol kuning)</li>
                      <li><strong>3.</strong> Atau akses langsung: <code>https://z-lib.id/how-to-donate#promocode</code></li>
                      <li><strong>4.</strong> Abaikan semua opsi pembayaran - scroll ke bawah</li>
                      <li><strong>5.</strong> Cari link kecil &quot;Promo Code&quot; (biasanya dengan ikon %)</li>
                      <li><strong>6.</strong> Klik link tersebut - text box akan muncul</li>
                      <li><strong>7.</strong> Paste kode (contoh: ZLIBGIFT4U) tanpa spasi</li>
                      <li><strong>8.</strong> Klik &quot;Apply&quot; atau &quot;Redeem&quot;</li>
                      <li><strong>9.</strong> Notifikasi hijau akan konfirmasi penambahan kuota</li>
                    </ol>
                  </div>
                </CollapsibleSection>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Desktop App */}
          <TabsContent value="desktop" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Laptop className="h-5 w-5 text-emerald-600" />
                  Desktop App Download Portal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg mb-6">
                  <div className="flex items-start gap-3">
                    <Gift className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-800">Bonus Premium Eksklusif</p>
                      <p className="text-sm text-emerald-700">
                        Pengguna yang mengakses via aplikasi desktop mendapatkan
                        <strong> 1 bulan Premium Membership</strong> (999 download/hari) dan
                        setelahnya <strong>20 download/hari permanen</strong> (2x dari web).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <a
                    href="https://go-to-library.sk/#desktop_app_tab"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    https://go-to-library.sk/#desktop_app_tab
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    Portal distribusi software resmi - satu-satunya sumber yang diizinkan
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {desktopApps.map((app) => (
                    <div key={app.os} className="border rounded-lg p-4 hover:border-primary transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <app.icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{app.os}</p>
                          <p className="text-xs text-muted-foreground">{app.version}</p>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ukuran:</span>
                          <span>{app.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Format:</span>
                          <span>{app.type}</span>
                        </div>
                      </div>
                      {app.sha256 && (
                        <div className="mt-3 p-2 bg-muted rounded text-xs">
                          <p className="text-muted-foreground mb-1">SHA256:</p>
                          <code className="break-all">{app.sha256}</code>
                          <CopyButton text={app.sha256} />
                        </div>
                      )}
                      <p className="mt-3 text-xs text-muted-foreground">{app.note}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Promo Code */}
          <TabsContent value="promo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-emerald-600" />
                  Promo Code / Event Aktif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">
                  Kode promosi Z-Library bersifat time-sensitive. Update per 26 Februari 2026:
                </p>

                <div className="space-y-4">
                  {promoCodes.map((promo) => (
                    <div
                      key={promo.code}
                      className={cn(
                        "border-2 rounded-xl p-4",
                        promo.status === "active" ? "border-emerald-500 bg-emerald-50/30" : "border-gray-200 bg-gray-50"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <code className="px-2 py-1 bg-black text-white rounded font-mono text-lg">
                              {promo.code}
                            </code>
                            <Badge variant={promo.status === "active" ? "default" : "secondary"}>
                              {promo.status === "active" ? "AKTIF" : "EXPIRED"}
                            </Badge>
                          </div>
                          <p className="mt-2 text-sm font-medium">{promo.bonus}</p>
                          <p className="text-sm text-muted-foreground">{promo.context}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{promo.duration}</p>
                          {promo.status === "active" && (
                            <p className="text-xs text-amber-600 font-medium">{promo.expiry}</p>
                          )}
                        </div>
                      </div>
                      {promo.status === "active" && (
                        <div className="mt-3 flex items-center gap-2">
                          <CopyButton text={promo.code} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-medium text-blue-800">📅 Proyeksi Event Mendatang</p>
                  <p className="text-sm text-blue-700 mt-1">
                    <strong>Spring Fundraising 2026 (Maret-April):</strong> Z-Library biasanya menerbitkan
                    gelombang kode promo atau meluncurkan banner &quot;Unwrap It&quot; bertema musim semi.
                    Pantau header situs web pada periode Maret 2026.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Domain */}
          <TabsContent value="domains" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-emerald-600" />
                  Domain & Mirror Resmi Terbaru (2026)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-3 text-left font-semibold">Tipe</th>
                        <th className="py-3 px-3 text-left font-semibold">Domain</th>
                        <th className="py-3 px-3 text-left font-semibold">Status</th>
                        <th className="py-3 px-3 text-left font-semibold">Catatan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {domains.map((domain) => (
                        <tr key={domain.url} className="hover:bg-muted/50">
                          <td className="py-3 px-3">
                            <Badge variant={domain.status === "secure" ? "secondary" : "outline"}>
                              {domain.tier}
                            </Badge>
                          </td>
                          <td className="py-3 px-3">
                            <a
                              href={domain.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline break-all font-mono"
                            >
                              {domain.url}
                            </a>
                            <CopyButton text={domain.url} />
                          </td>
                          <td className="py-3 px-3">
                            {domain.status === "active" ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle2 className="h-4 w-4" /> Aktif
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-blue-600">
                                <Lock className="h-4 w-4" /> Secure
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-muted-foreground max-w-xs">{domain.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Security */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Peringatan Scam & Tips Keamanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {scamWarnings.map((scam) => (
                    <div
                      key={scam.title}
                      className={cn(
                        "border-2 rounded-xl p-4",
                        scam.severity === "high" ? "border-red-500 bg-red-50/30" : "border-amber-500 bg-amber-50/30"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <scam.icon className={cn(
                          "h-5 w-5 shrink-0 mt-0.5",
                          scam.severity === "high" ? "text-red-600" : "text-amber-600"
                        )} />
                        <div className="flex-1">
                          <h3 className="font-semibold">{scam.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{scam.description}</p>
                          <div className={cn(
                            "mt-3 p-3 rounded-lg text-sm",
                            scam.severity === "high" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                          )}>
                            <strong>Fakta:</strong> {scam.fact}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <CollapsibleSection title="Panduan Donasi yang Sah">
                  <div className="space-y-3 text-sm">
                    <p>Jika ingin berdonasi untuk mendukung Z-Library:</p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>
                          <strong>Amazon Gift Card:</strong> Beli digital gift card di Amazon.com →
                          copy kode → kirim ke email support Z-Library atau paste di formulir donasi.
                          Status Premium aktif dalam 24-48 jam.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>
                          <strong>Bank Card / Crypto:</strong> QR code Alipay untuk kartu bank.
                          Crypto hanya ke alamat wallet yang jelas dan terverifikasi di situs resmi.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        <span>
                          <strong>Hindari:</strong> Wire transfer instan, Azteco Coins, atau pembayaran
                          di luar sistem resmi Z-Library.
                        </span>
                      </li>
                    </ul>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Protokol OpSec untuk Power Researcher">
                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-muted rounded-lg">
                      <Lock className="h-5 w-5 text-violet-600 mb-2" />
                      <p className="font-medium">Password Isolasi</p>
                      <p className="text-muted-foreground mt-1">
                        Gunakan password Z-Library yang 100% berbeda dari password bank/sosial media.
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <Wifi className="h-5 w-5 text-blue-600 mb-2" />
                      <p className="font-medium">VPN Protection</p>
                      <p className="text-muted-foreground mt-1">
                        Gunakan VPN dengan strict No-Logs Policy untuk mengelabui pemblokiran ISP.
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <Server className="h-5 w-5 text-green-600 mb-2" />
                      <p className="font-medium">Cloud Backup</p>
                      <p className="text-muted-foreground mt-1">
                        Transfer hasil download langsung ke Google Drive agar tidak perlu re-download.
                      </p>
                    </div>
                  </div>
                </CollapsibleSection>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="font-medium text-emerald-800">✅ Doktrin Tertinggi</p>
                  <p className="text-sm text-emerald-700 mt-1">
                    Z-Library secara default menyediakan <strong>Free Access</strong> langsung setelah login.
                    Tidak ada biaya tersembunyi. Jika situs meminta pembayaran untuk download,
                    itu adalah <strong>SITE PALSU</strong> - tutup browser segera.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Annas Archive Section */}
        <Card className="mt-8 border-2 border-violet-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-violet-600" />
              Alternatif: Annas Archive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Sebagai alternatif Z-Library, Annas Archive (https://annas-archive.li/) adalah
              meta-search engine untuk shadow libraries yang mengindeks Z-Library, Library Genesis,
              Sci-Hub, dan sumber lainnya dalam satu antarmuka.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://annas-archive.li/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Buka Annas Archive
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Note */}
      <footer className="bg-muted py-8 mt-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            Guide ini dibuat untuk tujuan edukasi dan riset. Selalu patuhi hukum hak cipta di wilayah Anda.
            <br />
            Data terakhir update: 26 Februari 2026.
          </p>
        </div>
      </footer>
    </div>
  );
}
