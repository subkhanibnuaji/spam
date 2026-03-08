import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Star,
  Tag,
  User,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SimpleMarkdown } from '@/components/shared/simple-markdown';
import {
  LIBRARY_CONFIG,
  booksLibrary,
  formatDate,
  formatRelativeDate,
  getBookById,
  getBookCoverUrl,
  getCategoryBadgeClass,
  getRelatedBooks,
  getStatusBadgeClass,
  hasBookEbook,
  hasBookSummary,
  hasBookSummaryAndEbook,
} from '@/lib/data/books';

// ============================================================
// UNIVERSAL BOOK LIBRARY — DETAIL PAGE
// ============================================================
// 📌 CUSTOMIZE PER REPO: tidak ada yang perlu diubah di sini.
// ============================================================

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamicParams = true;

export function generateStaticParams() {
  return booksLibrary.map((b) => ({ id: b.id }));
}

export default async function BookDetailPage({ params }: Props) {
  const { id } = await params;
  const book = getBookById(id);
  if (!book) notFound();

  const related = getRelatedBooks(book);
  const hasSummary = hasBookSummary(book);
  const hasEbook = hasBookEbook(book);
  const hasAll = hasBookSummaryAndEbook(book);

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb ─────────────────────────────────────── */}
      <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
        <Link
          href={LIBRARY_CONFIG.baseRoute}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {LIBRARY_CONFIG.pageTitle}
        </Link>
        <ChevronRight className="size-3.5 text-muted-foreground/60" />
        <span className="max-w-[320px] truncate font-medium">{book.title}</span>
      </nav>

      <Button asChild variant="ghost" size="sm" className="gap-1.5">
        <Link href={LIBRARY_CONFIG.baseRoute}>
          <ArrowLeft className="size-4" />
          Back to Library
        </Link>
      </Button>

      {/* ── Main Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — Content */}
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{book.title}</h1>
            <p className="mt-1 text-base text-muted-foreground">
              by {book.author} · {book.year}
            </p>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground" style={{ lineHeight: '1.75' }}>
                {book.description}
              </p>
            </CardContent>
          </Card>

          {/* Key Takeaways */}
          {book.keyTakeaways.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Key Takeaways</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {book.keyTakeaways.map((t) => (
                    <li key={t} className="flex gap-2 text-sm">
                      <span className="mt-1 shrink-0 text-primary">•</span>
                      <span className="leading-relaxed text-muted-foreground">{t}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          {hasSummary ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Zero-Loss Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleMarkdown>{book.summaryMarkdown ?? ''}</SimpleMarkdown>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Summary Status</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                  <BookOpen className="size-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Ringkasan belum ditambahkan. Kirim materi — langsung diisi.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right — Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-5 pt-5">
              {/* Cover */}
              <div className="relative h-64 overflow-hidden rounded-lg bg-muted">
                <img
                  src={getBookCoverUrl(book)}
                  alt={`${book.title} by ${book.author}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 to-transparent" />
                <p className="absolute bottom-4 left-4 right-4 line-clamp-2 text-sm font-semibold text-white drop-shadow-sm">
                  {book.title}
                </p>
              </div>

              {/* eBook Access */}
              {hasEbook && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      E-Book Access
                    </p>
                    <div className="space-y-2">
                      {book.pdfUrl && (
                        <Button asChild size="sm" className="w-full justify-start">
                          <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer">
                            <BookOpen className="size-4" />
                            Read eBook
                            <ExternalLink className="ml-auto size-3.5 opacity-80" />
                          </a>
                        </Button>
                      )}
                      {(book.downloadUrl || book.pdfUrl) && (
                        <Button asChild size="sm" variant="outline" className="w-full justify-start">
                          <a href={book.downloadUrl || book.pdfUrl} download>
                            <Download className="size-4" />
                            Download eBook
                          </a>
                        </Button>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      PDF bisa langsung dibaca online atau diunduh untuk akses offline.
                    </p>
                  </div>
                </>
              )}

              {/* Metadata */}
              <Separator />
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Details
                </p>
                <div className="space-y-2">
                  {[
                    {
                      label: 'Status',
                      value: (
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(book.readingStatus)}`}>
                          {book.readingStatus.charAt(0).toUpperCase() + book.readingStatus.slice(1)}
                        </span>
                      ),
                    },
                    {
                      label: 'Category',
                      value: (
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryBadgeClass(book.category)}`}>
                          {book.category.charAt(0).toUpperCase() + book.category.slice(1)}
                        </span>
                      ),
                    },
                    {
                      label: 'Rating',
                      value: (
                        <span className="flex items-center gap-1 text-xs font-medium">
                          <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
                          {book.rating.toFixed(1)}
                        </span>
                      ),
                    },
                    {
                      label: 'Author',
                      value: (
                        <span className="flex items-center gap-1 text-xs font-medium">
                          <User className="size-3" />
                          {book.author}
                        </span>
                      ),
                    },
                    {
                      label: 'Published',
                      value: (
                        <span className="flex items-center gap-1 text-xs font-medium">
                          <Calendar className="size-3" />
                          {book.year}
                        </span>
                      ),
                    },
                    {
                      label: 'Added',
                      value: (
                        <span className="flex items-center gap-1 text-xs">
                          <Clock className="size-3" />
                          {formatRelativeDate(new Date(book.createdAt))}
                        </span>
                      ),
                    },
                    ...(book.updatedAt
                      ? [{ label: 'Updated', value: <span className="text-xs">{formatDate(new Date(book.updatedAt))}</span> }]
                      : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      {value}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="gap-1">
                      <Tag className="size-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Content availability indicator */}
              {hasAll && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-4" />
                    <span className="text-xs font-medium">
                      {LIBRARY_CONFIG.contentBadgeLabel} available
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Related Books ──────────────────────────────────── */}
      {related.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">You Might Also Like</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((rel) => (
              <Link key={rel.id} href={`${LIBRARY_CONFIG.baseRoute}/${rel.id}`}>
                <Card className="group h-full cursor-pointer overflow-hidden py-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <div className="relative h-32 overflow-hidden bg-muted">
                    <img
                      src={getBookCoverUrl(rel)}
                      alt={rel.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  <CardContent className="space-y-1 py-3">
                    <p className="truncate text-xs font-semibold transition-colors group-hover:text-primary">
                      {rel.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {rel.author} · {rel.year}
                    </p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3 ${i < Math.round(rel.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground/30'}`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
