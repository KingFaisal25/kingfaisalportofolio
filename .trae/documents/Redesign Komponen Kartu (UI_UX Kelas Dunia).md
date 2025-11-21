## Tujuan
Memodernisasi seluruh komponen kartu (services, projects, stats, expertise, highlights) agar rapi, konsisten, responsif, aksesibel, dan berperforma tinggi—setara portofolio kelas dunia.

## Ruang Lingkup File
- CSS: `styles/main-optimized.css`
- JS: modularisasi di `scripts/cards/` (ES modules) + update ringan pada `scripts/main-simple.js`
- HTML: penyesuaian minimal pada struktur kartu bila diperlukan (tanpa mengubah konten inti)

## Desain Sistem & Variabel
- Tambah variabel CSS (nama mengikuti konvensi yang ada):
  - Warna: `--primary-color`, `--secondary-color` (alias ke tokens eksisting `--color-primary`, `--color-secondary`)
  - Spacing: `--spacing-xs`, `--spacing-md`, `--spacing-lg` (alias ke `--space-xs/md/lg`)
  - Radius: `--border-radius-sm`, `--border-radius-lg` (alias ke `--radius-sm/lg`)
  - Shadow: `--shadow-sm`, `--shadow-lg` (pakai definisi eksisting, multi-layer untuk depth)
  - Icon sizes: `--icon-size-sm:16px`, `--icon-size-md:24px`, `--icon-size-lg:32px`

## Layout & Komponen Kartu
- Base class `.card` + varian `.card--service`, `.card--project`, `.card--stat`, `.card--expertise` (membungkus gaya umum: radius, shadow, padding, background glass, hover halus)
- Struktur (hierarki visual):
  1) Media/gambar (`.card-media`)
  2) Judul (`.card-title`)
  3) Meta/info (`.card-meta`/`.card-description`)
  4) Aksi (`.card-actions`)
- Grid & Flex:
  - Gunakan CSS Grid 12-kolom untuk container daftar kartu (services/projects)
  - Di dalam kartu, gunakan flex/flex-grid untuk header/meta/actions agar alignment rapi
- Breakpoints: mobile (≤768), tablet (768–1024), desktop (>1024)
- Whitespace: padding internal memakai skala 8px; jarak antar kartu konsisten

## Animasi & Micro-Interactions
- Transisi dasar: `transition: all 0.3s cubic-bezier(0.4,0,0.2,1)`
- Hover: elevasi shadow, `translateY(-2px)` halus, highlight gradien subtil pada border/background
- Animasi konten:
  - CSS transitions untuk efek dasar
  - GSAP (opsional via CDN) untuk animasi kompleks (zoom-in media, slide-up konten)
  - AOS: `fade-up` untuk kartu, `zoom-in` gambar, `slide` konten tekstual; `duration: 300–500ms`, `offset: 120px`

## JavaScript Modular (ES6)
- Buat folder `scripts/cards/` berisi:
  - `CardComponent.js`: API komponen (init, render opsional, state ringan)
  - `CardAnimations.js`: abstraksi animasi (GSAP bila tersedia; fallback CSS/IntersectionObserver)
  - `CardEvents.js`: event delegation (hover intent, focus, klik aksi, keyboard accessibility)
- Cara kerja:
  - `type="module"` loader ringan dari `index.html` untuk inisialisasi kartu (tanpa bundler)
  - Delegasi event dari container (mis. `.services-grid`, `.projects-grid`) untuk efisiensi
  - Fallback bila GSAP tidak ada (pakai CSS + IO)

## Ikon & Sizing
- Standarisasi kelas `.icon` dengan ukuran: `.icon-sm` (16px), `.icon-md` (24px), `.icon-lg` (32px)
- Hover ikon:
  - `transform: scale(1.05)`
  - transisi warna aksen
  - rotasi ringan untuk ikon interaktif (misalnya link demo/kode)
- Tetap gunakan Font Awesome 6 dan Material Icons (sudah ada); migrasi ke FA SVG Core bersifat opsional tanpa build step

## Tipografi
- Font utama: Inter/system UI; sekunder tetap Inter untuk konsistensi (tanpa menambah font baru)
- Type scale:
  - Base: 1rem (16px)
  - H1: 2.5rem, H2: 1.8rem, Body: 1rem
- Penyempurnaan:
  - `line-height: 1.5–1.6`
  - `letter-spacing: 0.5px` untuk judul dalam kartu

## AOS Konfigurasi
- Konsolidasi konfigurasi AOS:
  - `duration: 300–500ms`
  - `easing: cubic-bezier(0.25,0.1,0.25,1)`
  - `offset: 120px`
- Tetap di versi CDN yang tersedia (2.3.4); jika 3.x mudah diakses via CDN, lakukan upgrade aman (opsional)

## Dark Mode
- Variabel tema: `[data-theme="dark"]` override tokens warna; dukung `prefers-color-scheme`
- Toggle ringan via JS (opsional) tanpa menyimpan state; atau deteksi preferensi sistem

## Performance & Aksesibilitas
- Mobile-first; touch target ≥48px pada aksi kartu
- Defer animasi berat; hanya aktif saat kartu terlihat (IO)
- Optimasi gambar proyek ke `<picture>` (AVIF/WebP) + `srcset`/`sizes` (jika aset tersedia)
- ARIA & semantik:
  - Landmark dan urutan fokus logis
  - `aria-label`/`aria-current` untuk navigasi; `role` sesuai komponen (mis. buttons/links)

## Deliverables
- Implementasi front-end pada CSS/HTML/JS sesuai rencana
- Update Style Guide (`STYLE_GUIDE.md`) untuk tokens/komponen kartu/animasi/states
- (Opsional) Mockup Figma/Sketch bila Anda menyediakan referensi branding
- Prototype interaktif siap uji usability

## Pengujian & Target
- Viewport: 320/768/1024/1280/1440
- Cross-browser: Chrome, Firefox, Edge, Safari
- Lighthouse target: +≥20 poin, aksesibilitas WCAG AA, first interaction <100ms, pengurangan JS (15%) dengan delegasi event dan penghapusan duplikasi

Konfirmasi untuk mulai eksekusi sesuai rencana di atas (Track A tanpa build step). Jika ingin integrasi Tailwind (Track B), saya siapkan pipeline terpisah setelah tahap ini.