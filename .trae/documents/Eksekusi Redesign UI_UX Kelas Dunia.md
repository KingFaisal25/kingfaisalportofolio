## Gambaran Singkat
Redesign menyeluruh antarmuka portofolio dengan sistem desain modern dan konsisten: warna aksesibel, tipografi elegan, grid responsif, micro‑interactions halus, serta peningkatan aksesibilitas dan performa agar setara website kelas dunia.

## Desain Sistem
- Warna & Tokens: Palet harmonis (bg/surface/text/muted/primary/secondary/accent), kontras sesuai WCAG 2.1 AA.
- Tipografi: Skala modular 1.333 dengan `clamp()`; hierarki heading (700/800) dan body (400/500/600).
- Spacing & Radius: Skala 8px; radius 6/8/12; shadow halus untuk elevasi.

## Layout Global
- Container: `max-width 1440px`, padding lateral 5%.
- Grid 12-kolom: utilitas `.grid-12` + `.col-span-*` dan media queries.
- Breakpoints: Mobile <768, Tablet 768–1024, Desktop >1024.

## Komponen
- Header/Navigasi: Sticky, hamburger mobile, progress scroll ARIA, breadcrumb dinamis.
- Hero: Tipografi tegas, CTA kuat, visual proporsional, gambar `<picture>` (AVIF/WebP) + lazy load.
- About: Grid dua kolom (konten kiri, highlights kanan), stat cards horizontal, gambar overlay halus.
- Services: Kartu layanan modern, tags konsisten, interaksi hover ringan.
- Projects: Kartu portofolio radius konsisten, overlay interaktif, gambar responsif `clamp()`.
- Skills: Kategori dan statistik grid responsif (desktop/tablet/mobile).
- Contact: Form modern 12-kolom, fokus jelas, validasi real-time, ARIA live.
- Footer: Grid rapih, informasi dan tautan tersusun profesional.

## Interaksi & Animasi
- Transisi 300ms `cubic-bezier(0.4,0,0.2,1)`.
- Hover dan micro‑interactions pada tombol/kartu/link.
- Scroll-trigger: AOS standar; fallback animasi angka via IntersectionObserver.

## Aksesibilitas (WCAG 2.1 AA)
- Kontras teks (≥4.5:1), fokus terlihat, skip link, landmark semantics.
- ARIA untuk breadcrumb, progressbar, form status; keyboard navigable.

## Performa
- Gambar: `<picture>` + `srcset` dan `sizes` untuk resolusi berbeda; lazy load.
- Fonts: preconnect/preload, `font-display: swap`.
- PWA: update daftar cache aset produksi; strategi cache efisien.

## Implementasi Teknis
- Track A (langsung): Utility CSS kustom yang sudah ada (tanpa build step), konsisten dengan style saat ini.
- Track B (opsional): Integrasi Tailwind (butuh `npm` + pipeline), migrasi bertahap komponen ke utility framework.

## Deliverables
- Style guide & design system terbarui (palet, tipografi, spacing, grid, states, komponen).
- Prototype interaktif (HTML/CSS/JS) untuk uji usability.
- (Opsional) Mockup Figma/Sketch sesuai branding yang Anda inginkan.

## Pengujian & Validasi
- Viewport: 320/768/1024/1280/1440.
- Cross-browser: Chrome, Firefox, Edge, Safari.
- Aksesibilitas: audit kontras, fokus, ARIA, keyboard.
- Lighthouse: target skor ≥90 (desktop & mobile).

## Kriteria Penerimaan
- Desain konsisten dan aksesibel; grid responsif bekerja mulus.
- Interaksi halus; navigasi mudah dipahami.
- Gambar dioptimasi; PWA cache terbaru.
- Dokumentasi style guide lengkap dan sinkron dengan implementasi.

Konfirmasi untuk mulai eksekusi Track A segera (utility CSS kustom), dan beri tahu jika ingin mengaktifkan Track B (Tailwind) sebagai langkah berikutnya.