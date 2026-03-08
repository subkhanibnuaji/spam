'use client';

// ============================================================
// UNIVERSAL BOOK LIBRARY — LIST PAGE
// ============================================================
// 📌 CUSTOMIZE PER REPO: tidak ada yang perlu diubah di sini.
//    Semua konfigurasi ada di src/lib/data/books.ts
//    (LIBRARY_CONFIG + booksLibrary array).
// ============================================================

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowUpDown,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  LIBRARY_CONFIG,
  booksLibrary,
  formatRelativeDate,
  getBookCoverUrl,
  getCategoryBadgeClass,
  getFeaturedBook,
  getBookStats,
  getStatusBadgeClass,
  hasBookSummaryAndEbook,
  type BookStatus,
} from '@/lib/data/books';

// ── Filter & Sort Options ────────────────────────────────────
const CATEGORY_OPTIONS = [
  { label: 'All Categories', value: 'all' },
  { label: `With ${LIBRARY_CONFIG.contentBadgeLabel}`, value: 'with-summary' },
  { label: 'No Summary Yet', value: 'without-summary' },
  { label: 'Foundational', value: 'foundational' },
  { label: 'Advanced', value: 'advanced' },
  { label: 'Practical', value: 'practical' },
  { label: 'Research', value: 'research' },
  { label: 'Professional', value: 'professional' },
] as const;

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Reading', value: 'reading' },
  { label: 'Completed', value: 'completed' },
] as const;

const RATING_OPTIONS = [
  { label: 'All Ratings', value: 'all' },
  { label: '5 Stars', value: '5' },
  { label: '4+ Stars', value: '4' },
  { label: '3+ Stars', value: '3' },
] as const;

const SORT_OPTIONS = [
  { label: 'Title (A → Z)', value: 'title-asc' },
  { label: 'Title (Z → A)', value: 'title-desc' },
  { label: 'Author (A → Z)', value: 'author-asc' },
  { label: 'Author (Z → A)', value: 'author-desc' },
  { label: 'Year (Newest)', value: 'year-desc' },
  { label: 'Year (Oldest)', value: 'year-asc' },
  { label: 'Rating (Highest)', value: 'rating-desc' },
  { label: 'Rating (Lowest)', value: 'rating-asc' },
  { label: 'Recently Added', value: 'added-desc' },
  { label: 'Oldest Added', value: 'added-asc' },
] as const;

const ITEMS_PER_PAGE = 12;

// ── Sub-components ───────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < Math.round(rating)
              ? 'fill-yellow-500 text-yellow-500'
              : 'text-muted-foreground/30'
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function BooksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [ratingFilter, setRatingFilter] = useState(searchParams.get('rating') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'title-asc');
  const [hasSummaryOnly, setHasSummaryOnly] = useState(
    searchParams.get('hasSummary') === 'true',
  );
  const [currentPage, setCurrentPage] = useState(
    Number.parseInt(searchParams.get('page') || '1', 10),
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Persist view mode
  useEffect(() => {
    const stored = localStorage.getItem('bookViewMode');
    if (stored === 'grid' || stored === 'list') setViewMode(stored);
  }, []);
  useEffect(() => {
    localStorage.setItem('bookViewMode', viewMode);
  }, [viewMode]);

  // Sync URL params
  const updateUrl = useCallback(() => {
    const p = new URLSearchParams();
    if (search.trim()) p.set('search', search);
    if (category !== 'all') p.set('category', category);
    if (status !== 'all') p.set('status', status);
    if (ratingFilter !== 'all') p.set('rating', ratingFilter);
    if (sort !== 'title-asc') p.set('sort', sort);
    if (hasSummaryOnly) p.set('hasSummary', 'true');
    if (currentPage > 1) p.set('page', String(currentPage));
    const qs = p.toString();
    router.replace(
      qs ? `${LIBRARY_CONFIG.baseRoute}?${qs}` : LIBRARY_CONFIG.baseRoute,
      { scroll: false },
    );
  }, [search, category, status, ratingFilter, sort, hasSummaryOnly, currentPage, router]);

  useEffect(() => { updateUrl(); }, [updateUrl]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (category !== 'all') n++;
    if (status !== 'all') n++;
    if (ratingFilter !== 'all') n++;
    if (hasSummaryOnly) n++;
    return n;
  }, [category, status, ratingFilter, hasSummaryOnly]);

  // Filter + Sort
  const filtered = useMemo(() => {
    let books = booksLibrary;

    if (search.trim()) {
      const q = search.toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (category === 'with-summary') books = books.filter(hasBookSummaryAndEbook);
    else if (category === 'without-summary') books = books.filter((b) => !hasBookSummaryAndEbook(b));
    else if (category !== 'all') books = books.filter((b) => b.category === category);

    if (status !== 'all') books = books.filter((b) => b.readingStatus === status);

    if (ratingFilter !== 'all') {
      const min = Number.parseInt(ratingFilter, 10);
      books = books.filter((b) => b.rating >= min);
    }

    if (hasSummaryOnly) books = books.filter(hasBookSummaryAndEbook);

    const [field, dir] = sort.split('-');
    const d = dir === 'desc' ? -1 : 1;

    return [...books].sort((a, b) => {
      switch (field) {
        case 'title':  return d * a.title.localeCompare(b.title);
        case 'author': return d * a.author.localeCompare(b.author);
        case 'year':   return d * (a.year - b.year);
        case 'rating': return d * (a.rating - b.rating);
        case 'added': {
          const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return d * (da - db);
        }
        default: return 0;
      }
    });
  }, [search, category, status, ratingFilter, sort, hasSummaryOnly]);

  // Reset page on filter change
  useEffect(() => { setCurrentPage(1); }, [search, category, status, ratingFilter, sort, hasSummaryOnly]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const stats = getBookStats();
  const featured = getFeaturedBook();

  function clearAll() {
    setSearch('');
    setCategory('all');
    setStatus('all');
    setRatingFilter('all');
    setHasSummaryOnly(false);
    setCurrentPage(1);
  }

  return (
    <div className="space-y-6">
      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="hero-gradient -mx-4 -mt-4 rounded-b-xl px-4 py-8 md:-mx-6 md:px-6 md:py-10">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {LIBRARY_CONFIG.pageTitle}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground md:text-base">
            {LIBRARY_CONFIG.pageDescription}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{stats.total} Books</span>
            <span className="hidden text-border sm:inline">|</span>
            <span className="flex items-center gap-1">
              <Sparkles className="size-3.5 text-amber-500" />
              {stats.withContent} with {LIBRARY_CONFIG.contentBadgeLabel}
            </span>
            <span className="hidden text-border sm:inline">|</span>
            <span>{stats.completed} Read</span>
            <span className="hidden text-border sm:inline">|</span>
            <span>{stats.reading} Reading</span>
          </div>
        </div>
      </div>

      {/* ── Featured Book ─────────────────────────────────── */}
      {featured && activeFilterCount === 0 && !search.trim() && (
        <Link href={`${LIBRARY_CONFIG.baseRoute}/${featured.id}`} className="block">
          <Card className="cursor-pointer overflow-hidden border-primary/20 bg-primary/5 py-0 transition-colors hover:bg-primary/10">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="h-16 w-12 shrink-0 overflow-hidden rounded bg-muted">
                <img
                  src={getBookCoverUrl(featured)}
                  alt={featured.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0 flex-1">
                <Badge variant="secondary" className="mb-0.5 px-1.5 py-0 text-[10px]">
                  Top Rated
                </Badge>
                <p className="truncate text-sm font-semibold">{featured.title}</p>
                <p className="text-xs text-muted-foreground">
                  by {featured.author} · {featured.rating.toFixed(1)} stars
                </p>
              </div>
              <Eye className="hidden size-4 shrink-0 text-muted-foreground sm:block" />
            </CardContent>
          </Card>
        </Link>
      )}

      {/* ── Search + Sort + Filters ────────────────────────── */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <BookOpen className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, author, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              aria-label="Search books"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Sort + Filter toggle + View toggle */}
          <div className="flex items-center gap-2">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[180px]" aria-label="Sort">
                <ArrowUpDown className="mr-1.5 size-3.5 shrink-0" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFilters((v) => !v)}
              className="gap-1.5"
            >
              <SlidersHorizontal className="size-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>

            <div className="flex items-center rounded-md border">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-l-md p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                aria-label="Grid view"
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-r-md p-2 transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                aria-label="List view"
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="flex flex-col flex-wrap gap-3 rounded-lg border bg-muted/30 p-4 sm:flex-row">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                {RATING_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
              <Switch
                id="has-summary"
                checked={hasSummaryOnly}
                onCheckedChange={setHasSummaryOnly}
              />
              <label htmlFor="has-summary" className="cursor-pointer whitespace-nowrap text-sm">
                Has {LIBRARY_CONFIG.contentBadgeLabel}
              </label>
            </div>

            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-destructive hover:text-destructive">
                <X className="mr-1 size-3.5" />
                Clear all
              </Button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {paged.length} of {filtered.length} book{filtered.length !== 1 ? 's' : ''}
            {activeFilterCount > 0 || search ? ' (filtered)' : ''}
          </span>
          {totalPages > 1 && (
            <span>Page {currentPage} of {totalPages}</span>
          )}
        </div>
      </div>

      {/* ── Empty State ────────────────────────────────────── */}
      {paged.length === 0 ? (
        <Card className="border-dashed py-0">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="mb-3 size-8 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No books found</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {LIBRARY_CONFIG.emptyStateMessage}
            </p>
            {(activeFilterCount > 0 || search) && (
              <Button variant="outline" size="sm" className="mt-4" onClick={clearAll}>
                Clear all filters
              </Button>
            )}
          </CardContent>
        </Card>

      /* ── Grid View ─────────────────────────────────────── */
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paged.map((book) => {
            const hasContent = hasBookSummaryAndEbook(book);
            return (
              <Link key={book.id} href={`${LIBRARY_CONFIG.baseRoute}/${book.id}`} className="block">
                <Card className="book-card group h-full cursor-pointer overflow-hidden py-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative h-44 overflow-hidden bg-muted">
                    <img
                      src={getBookCoverUrl(book)}
                      alt={`${book.title} by ${book.author}`}
                      className="book-card-image h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="book-card-overlay absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground dark:bg-gray-900/90">
                        View Details
                      </span>
                    </div>
                    <h3 className="absolute bottom-3 left-3 right-3 line-clamp-2 text-sm font-semibold text-white drop-shadow-sm">
                      {book.title}
                    </h3>
                  </div>
                  <CardContent className="space-y-2.5 py-3.5">
                    <div>
                      <p className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
                        {book.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {book.author} · {book.year}
                      </p>
                      {book.createdAt && (
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground/70">
                          <Clock className="size-3" />
                          Added {formatRelativeDate(new Date(book.createdAt))}
                        </p>
                      )}
                    </div>
                    <StarRating rating={book.rating} />
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${getStatusBadgeClass(book.readingStatus)}`}>
                        {book.readingStatus.charAt(0).toUpperCase() + book.readingStatus.slice(1)}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${getCategoryBadgeClass(book.category)}`}>
                        {book.category.charAt(0).toUpperCase() + book.category.slice(1)}
                      </span>
                      {hasContent && (
                        <span className="badge-premium inline-flex items-center rounded-full px-2 py-0.5 text-[11px]">
                          {LIBRARY_CONFIG.contentBadgeLabel}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

      /* ── List View ─────────────────────────────────────── */
      ) : (
        <div className="space-y-3">
          {paged.map((book) => {
            const hasContent = hasBookSummaryAndEbook(book);
            return (
              <Link key={book.id} href={`${LIBRARY_CONFIG.baseRoute}/${book.id}`} className="block">
                <Card className="group cursor-pointer overflow-hidden py-0 transition-all duration-200 hover:shadow-md">
                  <CardContent className="flex gap-4 py-4">
                    <div className="h-28 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                      <img
                        src={getBookCoverUrl(book)}
                        alt={`${book.title} by ${book.author}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div>
                        <p className="line-clamp-1 text-sm font-semibold transition-colors group-hover:text-primary">
                          {book.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {book.author} · {book.year}
                        </p>
                      </div>
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {book.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <StarRating rating={book.rating} />
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${getStatusBadgeClass(book.readingStatus)}`}>
                          {book.readingStatus.charAt(0).toUpperCase() + book.readingStatus.slice(1)}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${getCategoryBadgeClass(book.category)}`}>
                          {book.category.charAt(0).toUpperCase() + book.category.slice(1)}
                        </span>
                        {hasContent && (
                          <span className="badge-premium inline-flex items-center rounded-full px-2 py-0.5 text-[11px]">
                            {LIBRARY_CONFIG.contentBadgeLabel}
                          </span>
                        )}
                        {book.createdAt && (
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground/70">
                            <Clock className="size-3" />
                            {formatRelativeDate(new Date(book.createdAt))}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* ── Pagination ────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            if (
              page === 1 ||
              page === totalPages ||
              Math.abs(page - currentPage) <= 1
            ) {
              return (
                <Button
                  key={page}
                  variant={page === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="min-w-[36px]"
                  aria-label={`Page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </Button>
              );
            }
            if (
              (page === 2 && currentPage > 3) ||
              (page === totalPages - 1 && currentPage < totalPages - 2)
            ) {
              return <span key={page} className="px-1 text-muted-foreground">...</span>;
            }
            return null;
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
