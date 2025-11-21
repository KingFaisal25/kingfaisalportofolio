## Gambaran Teknis Saat Ini
- Stack: HTML5 + CSS3 + JavaScript vanilla; tanpa Bootstrap/Tailwind/SCSS.
- Entry utama: `portfolio-website/index.html` (memuat `styles/main-optimized.css`, `scripts/main-simple.js`).
- Alternatif/dev: `portfolio-website/src/index.html` (memuat `styles/main.css`, `scripts/main.js`).
- Library CDN: Google Fonts (Inter/JetBrains Mono), Font Awesome, AOS (Animation on Scroll).
- PWA: `manifest.json`, `service-worker.js` (cache aset inti saat ini).
- Navigasi & section: header `<nav>` di `portfolio-website/index.html:61–108`, section `#projects` di `:840–999`, form `#contactForm` di `:1001–1196`, footer di `:1198–1286`.

## Tujuan Desain
- Tampilan modern, profesional, dan menarik; meningkatkan aksesibilitas (WCAG 2.1 AA), responsivitas, dan performa (Lighthouse >90).
- Menjaga fungsionalitas inti dan memperkuat branding profesional.

## Desain Sistem (Tokens & Foundations)
1. Warna
   - Definisikan palet kontemporer berbasis psikologi warna: `--color-bg`, `--color-surface`, `--color-text`, `--color-muted`, `--color-primary`, `--color-secondary`, `--color-accent`, `--color-success`, `--color-warning`, `--color-error`.
   - Pastikan kontras teks ≥4.5:1 untuk body; ≥3:1 untuk UI non-body.
   - Implementasi di `styles/main-optimized.css` pada root `:root` agar konsisten.
2. Tipografi
   - Font utama: Inter (body), Poppins/Inter (heading) via Google Fonts.
   - Skala modular 1.333 (Major Third) untuk `--fs-1` s.d. `--fs-7` dengan `clamp()` responsif.
   - Hierarki berat: 400/500/600/700; line-height 1.5 body, 1.2 heading.
3. Spacing & Radius
   - Skala 8px: `--space-1`=8px … `--space-8`=64px; terapkan ke padding/margin utilitas.
   - Radius: `--radius-sm`=6px, `--radius-md`=8px, `--radius-lg`=12px.
4. Elevation & Aksen
   - Shadow standar: `box-shadow: 0 4px 12px rgba(0,0,0,0.08)`.
   - Gradien halus: `--gradient-accent` untuk aksen tombol/heading.
5. Animasi
   - Durasi default 300ms, easing `cubic-bezier(0.4, 0, 0.2, 1)` untuk transisi; definisikan `--ease-standard`.

## Tata Letak & Grid
- Container: max-width 1440px, padding lateral 5% (`.container` update di `styles/main-optimized.css`).
- Grid 12 kolom utilitas: `.grid-12` dengan `grid-template-columns: repeat(12, 1fr)`; `.col-span-1..12` untuk kontrol kolom.
- Breakpoints:
  - Mobile `<768px`
  - Tablet `768–1024px`
  - Desktop `>1024px`
- Whitespace antar section ≥24px; gunakan skala spacing utilitas.
- Terapkan F-pattern melalui penempatan heading, subheading, CTA di bagian kiri/atas serta eye-guide visual.

## Komponen & Interaksi
1. Header & Navigasi
   - Sticky header; perbaiki transparansi/blur sesuai scroll.
   - Hamburger menu di mobile dengan animasi ikon dan fokus state aksesibel.
   - Breadcrumb dinamis (single-page): tampilkan jalur `Home > Section` berdasarkan IntersectionObserver (current section) di bawah header.
   - Indikator progress scroll: perbaiki akurasi dan aksesibilitas (aria-hidden/label).
2. Section
   - Hero: tipografi hierarkis, CTA prominent dengan micro-interactions.
   - About/Services/Projects/Skills/Contact: konsolidasikan kartu/konten dengan radius, shadow, dan gradient aksen.
3. Micro-interactions
   - Hover/active/focus untuk tombol/link/kartu; ripple/press feedback ringan.
   - Loading states (skeleton/spinner) pada komponen yang memerlukan waktu.
   - Form validation real-time dengan pesan ARIA-live dan indikator visual.

## Animasi
- Transisi halus untuk hover/fokus dan navigasi.
- Scroll-triggered via AOS standar; konsolidasikan durasi 300ms dan easing.
- IntersectionObserver untuk reveal halus pada komponen tanpa AOS (fallback).

## Responsivitas & Gambar
- Uji 5 viewport: 320, 768, 1024, 1280, 1440.
- Optimasi gambar:
  - Gunakan `<picture>`: sumber AVIF/WebP dengan fallback JPG/PNG.
  - `srcset` dan `sizes` untuk resolusi berbeda.
  - `loading="lazy"` untuk non-critical; `decoding="async"`.
- Touch target min 48x48px pada kontrol interaktif.

## Aksesibilitas (WCAG 2.1 AA)
- Semantik: heading order, landmark (`<header>`, `<main>`, `<nav>`, `<footer>`), skip-to-content.
- Focus-visible yang jelas; kontras memenuhi standar.
- ARIA: breadcrumb (`aria-label="Breadcrumb"`, `aria-current`), progress, form errors (role=alert, `aria-live=polite`).
- Keyboard: tab order logis; semua kontrol dapat diakses via keyboard.

## Performa
- Lighthouse target ≥90: 
  - Preconnect/preload Google Fonts; `font-display: swap`.
  - Minimalkan repaint/relayout; kurangi shadow berlebihan.
  - Inline critical CSS (hero/header) jika perlu; deferred script.
  - Service worker: tambah aset aktual (`main-optimized.css`, `main-simple.js`, gambar terkompresi) selain aset dev.

## Dokumentasi
- Perbarui `STYLE_GUIDE.md` dengan palet, tipografi, spacing, grid, komponen, states dan contoh kode.
- Tambah tabel token dan contoh penggunaan komponen.

## Rencana Implementasi (File-By-File)
1. `styles/main-optimized.css`
   - Tambah/rapikan design tokens warna/typography/spacing/radius/shadow/easing.
   - Definisikan utilitas: `.container`, `.grid-12`, `.col-span-*`, `.hide-mobile`, `.show-mobile`, spacing utils.
   - Terapkan gaya baru pada komponen: header/navbar, hero, cards, buttons, form, footer.
   - Standarisasi AOS durasi/easing.
2. `index.html`
   - Link/optimasi font (preconnect/preload); update markup untuk breadcrumb (`<nav aria-label="Breadcrumb">`).
   - Tambah `<picture>` untuk gambar profil dan aset proyek.
   - Tambah skip link; pastikan landmark dan heading order.
3. `scripts/main-simple.js`
   - Konsolidasikan hamburger, sticky header behavior, progress bar.
   - Breadcrumb dinamis via IntersectionObserver; ARIA updates.
   - Form validation real-time dengan pesan aksesibel dan micro-interactions.
4. `service-worker.js`
   - Update daftar cache: tambahkan `styles/main-optimized.css`, `scripts/main-simple.js`, gambar teroptimasi.
   - Strategi cache: stale-while-revalidate untuk HTML/CSS/JS; cache-first untuk gambar.
5. `STYLE_GUIDE.md`
   - Dokumentasikan sistem desain baru, tokens, grid 12-kolom, breakpoints, animasi, states, pola komponen.

## Pengujian & Verifikasi
- Responsivitas: manual di 5 viewport; perbaiki layout jika ada overflow.
- Aksesibilitas: audit kontras, navigasi keyboard, fokus, ARIA.
- Cross-browser: Chrome, Firefox, Edge, Safari (verifikasi CSS/JS kompatibel dan fallback).
- Performa: Lighthouse di desktop/mobile; iterasi sampai skor ≥90.

## Kriteria Penerimaan
- Palet warna dan tipografi sesuai spesifikasi.
- Grid 12-kolom dengan breakpoints berjalan baik.
- Interaksi (hamburger, breadcrumb, progress, hover/focus, animasi scroll) konsisten dan aksesibel.
- Gambar teroptimasi dengan `srcset`/AVIF/WebP + lazy loading.
- WCAG 2.1 AA terpenuhi untuk kontras/fokus/keyboard/ARIA.
- Lighthouse ≥90; fungsionalitas portfolio tetap utuh.

## Catatan Risiko & Mitigasi
- Service worker cache lama: sinkronkan aset produksi dan tambah versioning cache.
- Perubahan gaya luas: lakukan secara bertahap dan uji section-per-section untuk mencegah regressi.
- Variasi font CDN: preload subset untuk mengurangi LCP dan FOIT.

Silakan konfirmasi untuk mulai eksekusi implementasi sesuai rencana di atas.