import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

export const metadata: Metadata = {
  title: "Surface Repair Finder Jakarta",
  description:
    "Comprehensive database of Microsoft Surface repair shops in Jakarta with intelligent trip planning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="font-sans">
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="pb-20 md:pb-8">{children}</main>
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
