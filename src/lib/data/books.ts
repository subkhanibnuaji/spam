// ============================================================
// UNIVERSAL BOOK LIBRARY — DATA LAYER
// ============================================================
// 📌 CUSTOMIZE PER REPO: hanya bagian CONTENT CONFIGURATION
//    dan array booksLibrary[] yang perlu diubah.
//    Schema, helpers, dan utils JANGAN diubah antar repo.
// ============================================================

// ────────────────────────────────────────────────────────────
// 📌 CONTENT CONFIGURATION — Edit per repo
// ────────────────────────────────────────────────────────────
export const LIBRARY_CONFIG = {
  /** Nama domain repo ini, tampil di heading & breadcrumb */
  domainName: 'Spam',

  /** Judul halaman library */
  pageTitle: 'Spam Book Library',

  /** Deskripsi singkat di hero section */
  pageDescription:
    'Curated collection of essential spam books with summaries and downloadable eBooks.',

  /** Route dasar — biasanya konsisten: /resources/books */
  baseRoute: '/resources/books',

  /** Label badge "has content" */
  contentBadgeLabel: 'Summary + eBook',

  /** Empty state message */
  emptyStateMessage: 'No spam books found matching your criteria.',
} as const;

// ────────────────────────────────────────────────────────────
// TYPES — Frozen, sama di semua repo
// ────────────────────────────────────────────────────────────
export type BookCategory =
  | 'foundational'
  | 'advanced'
  | 'practical'
  | 'research'
  | 'professional';

export type BookStatus = 'unread' | 'reading' | 'completed';

export interface LibraryBook {
  /** URL-safe unique ID, e.g. 'atomic-habits-james-clear' */
  id: string;
  title: string;
  author: string;
  year: number;
  description: string;
  category: BookCategory;
  /** 1.0 – 5.0 */
  rating: number;
  readingStatus: BookStatus;
  /** Hex color untuk SVG cover fallback, e.g. '#1d4ed8' */
  coverColor: string;
  tags: string[];
  /** 3–5 bullet takeaways */
  keyTakeaways: string[];
  /** Markdown ringkasan panjang — opsional */
  summaryMarkdown?: string;
  /** URL gambar cover eksternal — opsional, fallback ke SVG jika kosong */
  coverImageUrl?: string;
  /** URL PDF untuk read online */
  pdfUrl?: string;
  /** URL PDF untuk download — boleh sama dengan pdfUrl */
  downloadUrl?: string;
  /** ISO date string YYYY-MM-DD */
  createdAt: string;
  /** ISO date string YYYY-MM-DD, opsional */
  updatedAt?: string;
}

// ────────────────────────────────────────────────────────────
// 📌 BOOKS DATA — Kirim materi → isi bagian ini
// ────────────────────────────────────────────────────────────
// Format per entry:
// {
//   id: 'slug-unik-judul-buku',
//   title: 'Judul Lengkap Buku',
//   author: 'Nama Penulis',
//   year: 2024,
//   description: 'Deskripsi 1–3 kalimat.',
//   category: 'foundational' | 'advanced' | 'practical' | 'research' | 'professional',
//   rating: 4.8,
//   readingStatus: 'unread' | 'reading' | 'completed',
//   coverColor: '#hex',
//   tags: ['tag1', 'tag2'],
//   keyTakeaways: ['Poin 1', 'Poin 2', 'Poin 3'],
//   summaryMarkdown: `# Judul\n\n...`,   // kirim sebagai teks markdown
//   pdfUrl: '/resources/uploads/nama-file.pdf',
//   downloadUrl: '/resources/uploads/nama-file.pdf',
//   createdAt: '2026-03-08',
// }

export const booksLibrary: LibraryBook[] = [
  // ── SAMPLE ENTRY — hapus & ganti dengan data real saat materi dikirim ──
  {
    id: 'sample-book-01',
    title: '[Judul Buku 1 — kirim materinya]',
    author: 'Nama Penulis',
    year: 2024,
    description:
      'Placeholder entry. Kirim judul, penulis, deskripsi, PDF, dan rangkuman — langsung dimasukkan.',
    category: 'foundational',
    rating: 4.8,
    readingStatus: 'reading',
    coverColor: '#1d4ed8',
    tags: ['placeholder', 'spam'],
    keyTakeaways: [
      'Takeaway 1 akan diisi saat materi dikirim.',
      'Takeaway 2 akan diisi saat materi dikirim.',
      'Takeaway 3 akan diisi saat materi dikirim.',
    ],
    summaryMarkdown: undefined,
    pdfUrl: undefined,
    createdAt: '2026-03-08',
  },
  {
    id: 'sample-book-02',
    title: '[Judul Buku 2 — kirim materinya]',
    author: 'Nama Penulis',
    year: 2023,
    description:
      'Placeholder entry kedua. Setiap repo boleh punya jumlah buku berbeda.',
    category: 'practical',
    rating: 4.6,
    readingStatus: 'unread',
    coverColor: '#0f766e',
    tags: ['placeholder', 'skills'],
    keyTakeaways: [
      'Takeaway 1.',
      'Takeaway 2.',
      'Takeaway 3.',
    ],
    createdAt: '2026-03-08',
  },
];

// ────────────────────────────────────────────────────────────
// HELPERS — Frozen, jangan diubah
// ────────────────────────────────────────────────────────────
export function getBookById(id: string): LibraryBook | undefined {
  return booksLibrary.find((b) => b.id === id);
}

export function hasBookSummary(book: LibraryBook): boolean {
  return Boolean(book.summaryMarkdown?.trim());
}

export function hasBookEbook(book: LibraryBook): boolean {
  return Boolean(book.pdfUrl || book.downloadUrl);
}

export function hasBookSummaryAndEbook(book: LibraryBook): boolean {
  return hasBookSummary(book) && hasBookEbook(book);
}

export function getBookStats() {
  const total = booksLibrary.length;
  const withContent = booksLibrary.filter(hasBookSummaryAndEbook).length;
  const completed = booksLibrary.filter((b) => b.readingStatus === 'completed').length;
  const reading = booksLibrary.filter((b) => b.readingStatus === 'reading').length;
  const avgRating =
    total > 0
      ? (booksLibrary.reduce((sum, b) => sum + b.rating, 0) / total).toFixed(1)
      : '0.0';
  return { total, withContent, completed, reading, avgRating };
}

export function getFeaturedBook(): LibraryBook | null {
  if (booksLibrary.length === 0) return null;
  return [...booksLibrary].sort((a, b) => b.rating - a.rating)[0] ?? null;
}

export function getRelatedBooks(book: LibraryBook, limit = 4): LibraryBook[] {
  return booksLibrary
    .filter((b) => b.id !== book.id && b.category === book.category)
    .slice(0, limit);
}

function normalizeText(val: string): string {
  return val.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function escapeSvg(val: string): string {
  return val
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** SVG cover fallback — dipanggil otomatis jika coverImageUrl kosong */
export function getBookCoverFallback(
  book: Pick<LibraryBook, 'title' | 'author' | 'coverColor'>,
): string {
  const title = book.title.length > 34 ? `${book.title.slice(0, 31)}...` : book.title;
  const author = book.author.length > 30 ? `${book.author.slice(0, 27)}...` : book.author;
  const color = book.coverColor || '#334155';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${color}"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
  </defs>
  <rect width="400" height="600" fill="url(#bg)"/>
  <rect x="26" y="26" width="348" height="548" rx="14" fill="none" stroke="rgba(255,255,255,0.22)"/>
  <text x="36" y="70" fill="rgba(255,255,255,0.75)" font-size="16"
    font-family="system-ui,sans-serif" letter-spacing="2">BOOK LIBRARY</text>
  <text x="36" y="420" fill="#ffffff" font-size="28"
    font-family="Georgia,serif" font-weight="700">${escapeSvg(title)}</text>
  <text x="36" y="462" fill="#E5E7EB" font-size="18"
    font-family="system-ui,sans-serif">${escapeSvg(author)}</text>
</svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

/** Open Library cover ID map — tambah entri jika buku dikenal OL */
const OL_COVER_MAP: Record<string, number> = {
  [`${normalizeText('Deep Work')}::${normalizeText('Cal Newport')}`]: 8244151,
  [`${normalizeText('Atomic Habits')}::${normalizeText('James Clear')}`]: 10521270,
};

export function getBookCoverUrl(
  book: Pick<LibraryBook, 'title' | 'author' | 'coverColor' | 'coverImageUrl'>,
): string {
  if (book.coverImageUrl) return book.coverImageUrl;
  const key = `${normalizeText(book.title)}::${normalizeText(book.author)}`;
  const coverId = OL_COVER_MAP[key];
  if (coverId) return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  return getBookCoverFallback(book);
}

export function getCategoryBadgeClass(category: BookCategory): string {
  const map: Record<BookCategory, string> = {
    foundational: 'badge-foundational',
    practical: 'badge-practical',
    advanced: 'badge-advanced',
    research: 'badge-research',
    professional: 'badge-professional',
  };
  return map[category] ?? '';
}

export function getStatusBadgeClass(status: BookStatus): string {
  switch (status) {
    case 'reading':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300';
  }
}

export function formatRelativeDate(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const days = Math.floor(diffMs / 86_400_000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  if (days < 1) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (weeks === 1) return '1 week ago';
  if (weeks < 4) return `${weeks} weeks ago`;
  if (months === 1) return '1 month ago';
  if (months < 12) return `${months} months ago`;
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(date);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
