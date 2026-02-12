"use client";

import Link from "next/link";
import { Wrench, ClipboardCheck, ArrowRight } from "lucide-react";

const apps = [
  {
    name: "Jakarta Surface Repair Route Planner",
    description:
      "Database service center terverifikasi untuk Microsoft Surface & laptop premium di Jakarta. Route planner, shop finder, dan trip optimizer.",
    href: "/shops",
    icon: Wrench,
    gradient: "from-blue-600 to-indigo-700",
    iconBg: "bg-blue-500",
    links: [
      { label: "Browse Shops", href: "/shops" },
      { label: "Trip Planner", href: "/trip-planner" },
    ],
  },
  {
    name: "Presensi",
    description:
      "Sistem presensi personal dengan tracking kehadiran harian, history lengkap, dan export laporan ke CSV.",
    href: "/presensi",
    icon: ClipboardCheck,
    gradient: "from-teal-500 to-emerald-600",
    iconBg: "bg-teal-500",
    links: [
      { label: "Presensi Harian", href: "/presensi" },
      { label: "History & Export", href: "/presensi/history" },
    ],
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Super App
        </h1>
        <p className="mt-2 text-gray-500">
          Pilih aplikasi yang ingin kamu gunakan
        </p>
      </div>

      {/* App Cards */}
      <div className="space-y-5">
        {apps.map((app) => {
          const Icon = app.icon;
          return (
            <Link key={app.name} href={app.href} className="block group">
              <div
                className={`rounded-2xl bg-gradient-to-br ${app.gradient} p-6 text-white shadow-lg transition-transform group-hover:-translate-y-0.5 group-hover:shadow-xl`}
              >
                <div className="flex items-start gap-4">
                  <div className={`rounded-xl ${app.iconBg} p-3 shadow-inner`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold leading-tight">
                      {app.name}
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/80">
                      {app.description}
                    </p>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-white/60 transition-transform group-hover:translate-x-1" />
                </div>

                {/* Sub-links */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {app.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-white/25"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
