import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Code2,
  Download,
  FileText,
  Layers,
  Sparkles,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const categoryDistribution = [
  {
    category: "Project Management & Collaboration",
    total: 8,
    avgScore: 8.2,
    bestTarget: "Linear, Trello, Asana, Notion",
  },
  {
    category: "Communication & Messaging",
    total: 6,
    avgScore: 7.8,
    bestTarget: "Slack, Discord",
  },
  {
    category: "Document & Knowledge Management",
    total: 5,
    avgScore: 7.2,
    bestTarget: "Notion, Coda, Confluence",
  },
  {
    category: "Analytics & Monitoring",
    total: 4,
    avgScore: 7,
    bestTarget: "Plausible, PostHog, Sentry",
  },
  {
    category: "Marketing & Email Automation",
    total: 5,
    avgScore: 6.8,
    bestTarget: "Mailchimp-style, ConvertKit-style",
  },
  {
    category: "Scheduling & Booking",
    total: 3,
    avgScore: 7.3,
    bestTarget: "Calendly, Cal.com",
  },
  {
    category: "Developer Tools & Infrastructure",
    total: 7,
    avgScore: 7.6,
    bestTarget: "Retool-simplified, Supabase, PagerDuty",
  },
  {
    category: "AI/ML Application Platforms",
    total: 4,
    avgScore: 7,
    bestTarget: "Dify, AI SaaS templates",
  },
];

const complexityDistribution = [
  {
    level: "Beginner",
    total: 12,
    fitFor: "Developer baru mulai SaaS, familiar dengan CRUD",
    timeline: "4-6 minggu",
    characteristics:
      "Single page apps, minimal real-time, CRUD standar, Stripe checkout sederhana.",
  },
  {
    level: "Intermediate",
    total: 18,
    fitFor: "Developer dengan pengalaman 1-2 proyek full-stack",
    timeline: "8-12 minggu",
    characteristics:
      "Multi-tenant awal, WebSockets, API integrations, subscription billing lengkap.",
  },
  {
    level: "Advanced",
    total: 13,
    fitFor: "Developer targeting production-grade skills",
    timeline: "12-16+ minggu",
    characteristics:
      "CRDTs, microservices, advanced permissions, offline-first, scaling challenges.",
  },
];

const tierOneTargets = [
  {
    name: "Linear",
    score: 8.8,
    url: "https://linear.app",
    category: "Project Management / Developer Tools",
    summary:
      "Issue tracking modern dengan keyboard-first UX, animasi halus, dan perceived performance super cepat.",
    why:
      "Ideal untuk belajar architecture real-time dan performance engineering. Clone ini melatih optimistic updates, state sync, dan query filtering advanced.",
    coreFeatures: [
      "Issue CRUD dengan rich text dan markdown",
      "Keyboard shortcuts + command palette",
      "Cycles / roadmap planning",
      "Real-time synchronization multi-user",
      "Custom views: list, board, timeline, calendar",
    ],
    technicalChallenges: [
      "Sub-100ms interaction lewat cache dan request batching",
      "Distributed state consistency antarklien",
      "Event handling kompleks untuk keyboard navigation",
    ],
    timeline: "MVP 8-10 minggu (2-3 minggu dengan AI assist)",
    resources: [
      {
        label: "Martin Alderson - Attack of the SaaS clones",
        url: "https://martinalderson.com/posts/attack-of-the-clones/",
      },
      {
        label: "Linear API Documentation",
        url: "https://developers.linear.app/docs/graphql/working-with-the-graphql-api",
      },
    ],
  },
  {
    name: "Notion",
    score: 8.5,
    url: "https://notion.so",
    category: "Document & Knowledge Management",
    summary:
      "Workspace all-in-one dengan block editor, nested pages, database views, dan kolaborasi real-time.",
    why:
      "Sangat kuat untuk belajar editor architecture, flexible schema design, dan collaborative systems berbasis CRDT.",
    coreFeatures: [
      "Block-based editor (paragraph, heading, list, todo, code block)",
      "Nested page hierarchy dengan breadcrumb",
      "Database blocks dengan filter/sort/views",
      "Full-text search lintas halaman",
      "Permission model read/edit/admin",
    ],
    technicalChallenges: [
      "CRDT / OT merge logic untuk concurrent edits",
      "Recursive permission inheritance pada tree pages",
      "Polymorphic block storage + traversal efisien",
    ],
    timeline: "MVP solo 10-12 minggu, full collaboration 20+ minggu",
    resources: [
      { label: "Yjs Documentation", url: "https://docs.yjs.dev/" },
      { label: "ProseMirror Guide", url: "https://prosemirror.net/docs/guide/" },
    ],
  },
  {
    name: "Slack",
    score: 8.5,
    url: "https://slack.com",
    category: "Communication / Messaging",
    summary:
      "Platform komunikasi tim dengan channels, DM, threads, search, dan integrasi bot/app.",
    why:
      "Cocok untuk memperdalam message architecture produksi: scaling WebSocket, persistence, indexing search, dan sistem notifikasi.",
    coreFeatures: [
      "Channel public/private + member management",
      "Threaded messaging + emoji reactions",
      "Direct message 1:1 dan group DM",
      "File sharing + attachment preview",
      "Search lintas pesan dan dokumen",
    ],
    technicalChallenges: [
      "Horizontal websocket scaling via Redis adapter",
      "Message persistence untuk channel besar",
      "Search indexing pipeline real-time",
    ],
    timeline: "MVP 8-12 minggu",
    resources: [
      {
        label: "Slack Platform Documentation",
        url: "https://api.slack.com/docs",
      },
      {
        label: "Socket.IO Scaling Guide",
        url: "https://socket.io/docs/v4/using-multiple-nodes/",
      },
    ],
  },
];

const recommendedStack = [
  {
    layer: "Frontend",
    recommendation: "Next.js + React + TypeScript",
    why: "Cepat untuk shipping fitur sekaligus tetap maintainable.",
  },
  {
    layer: "Backend",
    recommendation: "Node.js service + WebSocket",
    why: "Cocok untuk event-driven workflows dan real-time feature.",
  },
  {
    layer: "Database",
    recommendation: "PostgreSQL + Redis",
    why: "Relational consistency plus cache/pubsub untuk performa.",
  },
  {
    layer: "Search",
    recommendation: "Meilisearch / Elasticsearch",
    why: "Fast full-text search dengan relevancy tuning.",
  },
  {
    layer: "Auth",
    recommendation: "Clerk / Auth.js + org support",
    why: "Mempercepat setup auth multi-user dan team scope.",
  },
  {
    layer: "Deploy",
    recommendation: "Vercel + managed Postgres",
    why: "Deploy cepat, observability ready, dan efisien untuk iterasi.",
  },
];

export default function SaaSCloneMaterialPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/60 to-cyan-50/50">
      <section className="relative overflow-hidden border-b bg-slate-950 text-slate-100">
        <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Badge className="mb-4 border-amber-300/40 bg-amber-300/20 text-amber-100 hover:bg-amber-300/20">
            Curated Learning Material
          </Badge>
          <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">
            SaaS Clone Landscape 2026
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-200 sm:text-lg">
            Halaman khusus materi riset platform SaaS untuk cloning edukasi.
            Sudah termasuk executive summary, breakdown complexity, target prioritas,
            embedded PDF, dan link download deck PPT.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="/materials/saas-clone-landscape.pdf" download>
              <Button className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </a>
            <a href="/materials/saas-clone-landscape.pptx" download>
              <Button variant="outline" className="border-slate-300/40 bg-transparent text-slate-100 hover:bg-slate-800">
                <FileText className="mr-2 h-4 w-4" />
                Download Full PPT
              </Button>
            </a>
            <Link href="/saas-clone-material/code-output">
              <Button variant="outline" className="border-slate-300/40 bg-transparent text-slate-100 hover:bg-slate-800">
                <Code2 className="mr-2 h-4 w-4" />
                Halaman Output Code
              </Button>
            </Link>
            <Link href="/trello-premium-guide">
              <Button variant="outline" className="border-slate-300/40 bg-transparent text-slate-100 hover:bg-slate-800">
                <BookOpen className="mr-2 h-4 w-4" />
                Trello Premium Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
        <Card className="border-slate-200/70 bg-white/85 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Platform Terkurasi
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-black text-slate-900">40+</CardContent>
        </Card>
        <Card className="border-slate-200/70 bg-white/85 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Zona Belajar Terbaik
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-black text-slate-900">8-12 minggu</CardContent>
        </Card>
        <Card className="border-slate-200/70 bg-white/85 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Tutorial End-to-End Verified
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-black text-slate-900">15-20</CardContent>
        </Card>
        <Card className="border-slate-200/70 bg-white/85 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Best Composite Band
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-black text-slate-900">Tier 1</CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <Card className="border-cyan-100 bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-black text-slate-900">
              <Sparkles className="h-6 w-6 text-cyan-600" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
              Ekosistem cloneable SaaS saat ini sangat terkonsentrasi pada produk
              kolaborasi dan komunikasi. Learning value tertinggi ditemukan pada
              proyek dengan kompleksitas menengah, dengan 4-6 tantangan teknis bermakna
              dalam timeline 8-12 minggu. Momentum terbesar datang dari AI-assisted
              development: developer kini dapat mereplikasi core workflow aplikasi
              kompleks jauh lebih cepat, tetapi tetap perlu disiplin scope dan quality
              untuk mencapai production quality.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200/80 bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-black">
                <BarChart3 className="h-5 w-5 text-cyan-600" />
                Distribusi per Kategori
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryDistribution.map((item) => {
                const percentage = Math.min(100, Math.round((item.avgScore / 10) * 100));
                return (
                  <div key={item.category} className="rounded-xl border bg-slate-50 p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{item.category}</p>
                      <Badge className="bg-slate-900 text-white hover:bg-slate-900">
                        {item.total} SaaS
                      </Badge>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-slate-600">
                      Avg score {item.avgScore.toFixed(1)} · Best target {item.bestTarget}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-black">
                <Layers className="h-5 w-5 text-amber-600" />
                Distribusi Complexity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {complexityDistribution.map((item) => (
                <div key={item.level} className="rounded-xl border bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">{item.level}</h3>
                    <Badge className="bg-amber-500 text-slate-900 hover:bg-amber-500">
                      {item.total} Project
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600">{item.fitFor}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{item.timeline}</p>
                  <p className="mt-1 text-xs text-slate-600">{item.characteristics}</p>
                </div>
              ))}
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                Insight penting: complexity inflation sering terjadi, rata-rata estimasi
                awal developer meleset 30-50% untuk kondisi production-ready.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <Target className="h-6 w-6 text-cyan-600" />
          <h2 className="text-2xl font-black text-slate-900">Tier 1 Elite Clone Targets</h2>
        </div>
        <div className="space-y-6">
          {tierOneTargets.map((target) => (
            <Card key={target.name} className="overflow-hidden border-slate-200 bg-white">
              <CardHeader className="border-b bg-slate-50/80">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl font-black text-slate-900">
                      {target.name}
                    </CardTitle>
                    <p className="mt-1 text-sm text-slate-600">{target.category}</p>
                  </div>
                  <Badge className="bg-cyan-600 text-white hover:bg-cyan-600">
                    Score {target.score.toFixed(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 p-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-slate-700">{target.summary}</p>
                  <p className="text-sm leading-relaxed text-slate-700">{target.why}</p>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                    <span className="font-semibold text-slate-900">Timeline:</span> {target.timeline}
                  </div>
                  <a
                    href={target.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 hover:text-cyan-600"
                  >
                    Kunjungi product
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-900">Core Features</p>
                    <ul className="space-y-1 text-sm text-slate-700">
                      {target.coreFeatures.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-900">Technical Challenges</p>
                    <ul className="space-y-1 text-sm text-slate-700">
                      {target.technicalChallenges.map((challenge) => (
                        <li key={challenge} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-600" />
                          <span>{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-900">References</p>
                    <div className="flex flex-wrap gap-2">
                      {target.resources.map((resource) => (
                        <a
                          key={resource.url}
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
                        >
                          {resource.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-black text-slate-900">
              <BookOpen className="h-5 w-5 text-cyan-600" />
              Recommended Tech Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl border">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-900 text-slate-100">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Layer</th>
                    <th className="px-4 py-3 font-semibold">Recommendation</th>
                    <th className="px-4 py-3 font-semibold">Rationale</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendedStack.map((row) => (
                    <tr key={row.layer} className="border-b last:border-b-0">
                      <td className="px-4 py-3 font-semibold text-slate-900">{row.layer}</td>
                      <td className="px-4 py-3 text-slate-700">{row.recommendation}</td>
                      <td className="px-4 py-3 text-slate-600">{row.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-black text-slate-900">
              <FileText className="h-5 w-5 text-cyan-600" />
              Materi PDF (Embedded)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-slate-600">
              Preview langsung dokumen yang kamu kirim. Untuk versi full file, pakai tombol download.
            </p>
            <div className="h-[70vh] overflow-hidden rounded-xl border bg-slate-100">
              <iframe
                src="/materials/saas-clone-landscape.pdf#toolbar=1&navpanes=0&view=FitH"
                className="h-full w-full"
                title="SaaS Clone Material PDF"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="/materials/saas-clone-landscape.pdf" download>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </a>
              <a href="/materials/saas-clone-landscape.pptx" download>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download PPT Lengkap
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
