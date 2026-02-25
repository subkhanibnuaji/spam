import { readFile } from "fs/promises";
import path from "path";
import Link from "next/link";
import {
  BookOpenText,
  CalendarClock,
  ChevronRight,
  Database,
  Download,
  FileText,
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Section = {
  id: string;
  title: string;
  body: string;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function readPublicText(filename: string): Promise<string> {
  const filePath = path.join(process.cwd(), "public", "materials", filename);
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

function splitMarkdownSections(markdown: string): { intro: string; sections: Section[] } {
  const normalized = markdown.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");

  const introLines: string[] = [];
  const sections: Section[] = [];

  let currentTitle = "";
  let currentBody: string[] = [];

  const flush = () => {
    if (!currentTitle) return;
    const body = currentBody.join("\n").trim();
    sections.push({
      id: slugify(currentTitle),
      title: currentTitle,
      body,
    });
    currentTitle = "";
    currentBody = [];
  };

  for (const line of lines) {
    if (line.startsWith("## ")) {
      flush();
      currentTitle = line.replace(/^##\s+/, "").trim();
      continue;
    }

    if (!currentTitle) {
      introLines.push(line);
    } else {
      currentBody.push(line);
    }
  }

  flush();

  return {
    intro: introLines.join("\n").trim(),
    sections,
  };
}

function splitDocxSections(raw: string): Section[] {
  const normalized = raw.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const sections: Section[] = [];

  let currentTitle = "Executive Material";
  let currentBody: string[] = [];

  const headingRegex = /^\d+(\.\d+)*\s+/;
  const flush = () => {
    const body = currentBody.join("\n").trim();
    if (!body) return;

    sections.push({
      id: `docx-${slugify(currentTitle)}`,
      title: currentTitle,
      body,
    });
    currentBody = [];
  };

  for (const line of lines) {
    if (headingRegex.test(line.trim())) {
      flush();
      currentTitle = line.trim();
      continue;
    }
    currentBody.push(line);
  }

  flush();
  return sections;
}

export default async function TrelloPremiumGuidePage() {
  const [ultimateGuide, docxExtracted] = await Promise.all([
    readPublicText("trello-premium-ultimate-guide.md"),
    readPublicText("trello-premium-x-ai-automation-guide-extracted.txt"),
  ]);

  const parsedGuide = splitMarkdownSections(ultimateGuide);
  const docxSections = splitDocxSections(docxExtracted);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/60 to-cyan-50/60">
      <section className="relative overflow-hidden border-b bg-slate-950 text-slate-100">
        <div className="absolute -left-44 top-0 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Badge className="mb-4 border-emerald-300/40 bg-emerald-300/20 text-emerald-100 hover:bg-emerald-300/20">
            Zero-Loss Knowledge Page
          </Badge>
          <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">
            Trello Premium Master Guide
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-200 sm:text-lg">
            Halaman khusus baru untuk semua materi Trello Premium yang kamu kirim.
            Seluruh informasi disimpan utuh (zero loss) dalam dua sumber:
            Ultimate Guide dan dokumen DOCX Trello Premium x AI Automation.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/materials/trello-premium-ultimate-guide.md" download>
              <Button className="bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                <Download className="mr-2 h-4 w-4" />
                Download Ultimate Guide (.md)
              </Button>
            </a>
            <a href="/materials/trello-premium-x-ai-automation-guide.docx" download>
              <Button
                variant="outline"
                className="border-slate-300/40 bg-transparent text-slate-100 hover:bg-slate-800"
              >
                <FileText className="mr-2 h-4 w-4" />
                Download Source DOCX
              </Button>
            </a>
            <a href="/materials/trello-premium-x-ai-automation-guide-extracted.txt" download>
              <Button
                variant="outline"
                className="border-slate-300/40 bg-transparent text-slate-100 hover:bg-slate-800"
              >
                <Database className="mr-2 h-4 w-4" />
                Download Extracted TXT
              </Button>
            </a>
            <Link href="/saas-clone-material">
              <Button
                variant="outline"
                className="border-slate-300/40 bg-transparent text-slate-100 hover:bg-slate-800"
              >
                Back to SaaS Material
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
        <Card className="border-slate-200/70 bg-white/90 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Premium Annual Price
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-black text-slate-900">$10/mo</CardContent>
        </Card>
        <Card className="border-slate-200/70 bg-white/90 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Board Views
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-black text-slate-900">6 Views</CardContent>
        </Card>
        <Card className="border-slate-200/70 bg-white/90 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Butler Runs
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-black text-slate-900">Unlimited</CardContent>
        </Card>
        <Card className="border-slate-200/70 bg-white/90 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Butler Ops (Solo)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-black text-slate-900">160K/mo</CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-black text-slate-900">
                <BookOpenText className="h-5 w-5 text-emerald-600" />
                Source A: Ultimate Guide (from prompt)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-slate-600">
                Struktur markdown dipetakan ke section-level cards agar mudah dibaca
                sambil menjaga isi asli tetap lengkap.
              </p>
              <div className="space-y-2">
                {parsedGuide.sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center justify-between rounded-lg border bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50/60"
                  >
                    <span>{section.title}</span>
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-black text-slate-900">
                <Sparkles className="h-5 w-5 text-amber-600" />
                Source B: DOCX AI Automation Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-slate-600">
                Dokumen DOCX kamu diekstrak ke plain text agar bisa dipresentasikan
                dan diverifikasi isi mentahnya.
              </p>
              <div className="space-y-2">
                {docxSections.slice(0, 14).map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center justify-between rounded-lg border bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:border-amber-200 hover:bg-amber-50/70"
                  >
                    <span>{section.title}</span>
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {parsedGuide.intro && (
        <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Card className="border-emerald-100 bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-black text-slate-900">
                <Zap className="h-5 w-5 text-emerald-600" />
                Intro Material
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {parsedGuide.intro}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {parsedGuide.sections.map((section) => (
          <Card key={section.id} id={section.id} className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-slate-900">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {section.body}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-4 pb-8 sm:px-6 lg:px-8">
        <Card className="border-amber-200 bg-amber-50/45">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-black text-slate-900">
              <CalendarClock className="h-5 w-5 text-amber-700" />
              Extracted DOCX Content (Sectioned)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700">
              Bagian ini menampilkan isi dokumen DOCX yang kamu kirim, sudah dipisah
              per heading numerik.
            </p>
          </CardContent>
        </Card>

        {docxSections.map((section) => (
          <Card key={section.id} id={section.id} className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-black text-slate-900">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {section.body}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-black text-slate-900">
              Verbatim Source Blocks (Zero-Loss Audit)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <details className="rounded-lg border bg-slate-50 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                Open full raw text: Ultimate Guide markdown
              </summary>
              <pre className="mt-3 max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-md border bg-slate-900 p-3 text-xs text-emerald-200">
                {ultimateGuide || "File kosong / tidak ditemukan."}
              </pre>
            </details>

            <details className="rounded-lg border bg-slate-50 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                Open full raw text: DOCX extracted transcript
              </summary>
              <pre className="mt-3 max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-md border bg-slate-900 p-3 text-xs text-emerald-200">
                {docxExtracted || "File kosong / tidak ditemukan."}
              </pre>
            </details>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
