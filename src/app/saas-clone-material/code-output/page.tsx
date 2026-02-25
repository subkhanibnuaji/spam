"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || value === null) {
    return String(value);
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "[unserializable value]";
  }
}

const starterCode = `const targets = [
  { name: "Linear", score: 8.8 },
  { name: "Notion", score: 8.5 },
  { name: "Slack", score: 8.5 }
];

const ranked = [...targets].sort((a, b) => b.score - a.score);
console.log("Top target:", ranked[0].name);
console.log("Average score:", (ranked.reduce((sum, item) => sum + item.score, 0) / ranked.length).toFixed(2));`;

export default function CodeOutputPage() {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("Belum ada output. Jalankan code untuk melihat hasil.");
  const [error, setError] = useState<string | null>(null);

  const hasUserCode = useMemo(() => code.trim().length > 0, [code]);

  const runCode = () => {
    const logs: string[] = [];
    setError(null);

    const consoleProxy = {
      log: (...args: unknown[]) => logs.push(args.map(formatValue).join(" ")),
      warn: (...args: unknown[]) => logs.push(`[warn] ${args.map(formatValue).join(" ")}`),
      error: (...args: unknown[]) => logs.push(`[error] ${args.map(formatValue).join(" ")}`),
    };

    try {
      const executor = new Function("console", `"use strict";\n${code}`);
      const returned = executor(consoleProxy);
      if (typeof returned !== "undefined") {
        logs.push(`return: ${formatValue(returned)}`);
      }

      if (logs.length === 0) {
        setOutput("Code berhasil jalan, tapi tidak ada output console.");
        return;
      }

      setOutput(logs.join("\n"));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown runtime error";
      setError(message);
      setOutput("Eksekusi gagal.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/40 to-amber-50/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Halaman Output Code</h1>
            <p className="mt-2 text-sm text-slate-600">
              Tempel snippet JavaScript untuk lihat output langsung. Halaman ini disiapkan
              khusus untuk kebutuhan demo code dari materi.
            </p>
          </div>
          <Link href="/saas-clone-material">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Materi
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-black text-slate-900">
                <Terminal className="h-5 w-5 text-cyan-600" />
                Input Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="h-[420px] w-full rounded-md border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-cyan-100 outline-none ring-cyan-500/40 transition focus:ring-2"
                spellCheck={false}
              />
              <div className="mt-4 flex items-center gap-3">
                <Button onClick={runCode} disabled={!hasUserCode}>
                  <Play className="mr-2 h-4 w-4" />
                  Jalankan Code
                </Button>
                <Badge variant="secondary">Runtime: Browser JS</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-black text-slate-900">Output</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="h-[420px] overflow-auto rounded-md border bg-slate-900 p-4 text-xs leading-relaxed text-emerald-300">
                {output}
              </pre>
              {error && (
                <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  Runtime error: {error}
                </div>
              )}
              <p className="mt-4 text-xs text-slate-500">
                Catatan: materi saat ini tidak menyertakan snippet code wajib, jadi area ini
                disiapkan untuk kebutuhan demo atau eksperimen tambahan.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
