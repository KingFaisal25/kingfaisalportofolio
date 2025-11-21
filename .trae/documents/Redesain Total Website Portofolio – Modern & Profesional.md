## Tujuan
- Membangun ulang UI/UX minimalis, harmonis, responsif, dan profesional.
- Memastikan semua fitur berfungsi optimal dengan navigasi intuitif, performa tinggi, dan validasi form yang baik.
- Menata kualitas kode dengan struktur terorganisir, best practices, dokumentasi, dan kompatibilitas lintas browser.
- Melakukan testing menyeluruh hingga siap produksi.

## 1) Desain UI/UX
- Konsep Visual:
  - Palet monokromatik dengan aksen brand yang konsisten (variabel `--brand`).
  - Design tokens: warna, spacing (8px scale), radius, shadow, typography.
- Layout Responsif:
  - Grid 12 kolom, container max 1440px, spacing vertikal 48/24px.
  - Breakpoints: 320/768/1024/1440.
- Typography:
  - Heading: Manrope (600/700); Body: Inter (400/500/600) dengan `clamp()` untuk skala adaptif.
- Animasi & Micro‑interactions:
  - AOS untuk animasi masuk yang halus dan menghormati `prefers‑reduced‑motion`.
  - Hover underline gradien pada navigasi, transisi 300ms pada CTA.

## 2) Fungsi Website
- Navigasi:
  - Struktur sederhana (5–7 item) + CTA Hubungi yang jelas; overlay mobile dengan blur.
  - Scrollspy untuk highlight item aktif; smooth scroll.
- Sections:
  - Hero (dua kolom dengan foto profil), Services, Projects (kartu + modal detail + filter), Testimonials, Contact, Consultation/AI, Footer.
- Form & Validasi:
  - Validasi client‑side dengan honeypot + CAPTCHA sederhana; integrasi WA API via webhook (fallback `wa.me`).
- Performa:
  - LCP: preload + `fetchpriority="high"` pada hero.
  - Lazy loading, `srcset/sizes` gambar, dimensi eksplisit untuk mencegah CLS.

## 3) Kualitas Kode
- Struktur & Best Practices:
  - HTML5 semantik (`header`, `nav`, `main`, `section`, `article`, `footer`).
  - CSS terorganisir dengan design tokens dan utility kelas ringan; hindari duplikasi.
  - JS modular: null‑check aman, aksesibilitas (ARIA), tanpa error runtime.
- Dokumentasi:
  - Style guide singkat (palet, tipografi, grid, komponen, aturan foto profil, aksesibilitas, performa).
- Kompatibilitas:
  - Cross‑browser utama (Chrome/Firefox/Safari/Edge).

## 4) Testing Menyeluruh
- Functional: navigasi, filter, modal, form kontak, scrollspy, AOS, PWA.
- Responsif: uji 320/768/1024/1440; pastikan tidak ada overlap/overflow.
- Lighthouse: target ≥90 untuk Accessibility/Best Practices/SEO; iterasi Performance bila perlu.
- Test suite: jalankan dan selaraskan kasus uji (DOM, desain, responsif, performa, aksesibilitas, teknis).

## 5) Optimasi Performa
- Gambar: kompresi lossless; opsi WebP/AVIF untuk aset final.
- Font: preconnect + `display=swap`; opsi self‑host subset untuk stabilitas jaringan.
- PWA: manifest + SW; runtime caching ringan untuk gambar statis, cache aset inti.
- Minimasi CSS/JS tak terpakai (opsional).

## 6) Deliverables
- Kode HTML/CSS/JS tersusun dengan design tokens, layout grid, komponen modular.
- Style guide dokumentasi.
- Laporan pengujian: hasil functional/responsif/Lighthouse; ringkasan optimasi performa.
- Siap produksi: tanpa error Console, tampilan profesional, dan performa optimal.

## 7) Rencana Eksekusi (Fase)
- Fase 1: Audit & desain sistem (tokens, palet, tipografi, grid) – 1–2 hari.
- Fase 2: Implementasi UI (Hero, Nav, Services, Projects+modal, Testimonials, Contact, Consultation/AI, Footer) – 2–3 hari.
- Fase 3: Validasi & integrasi (form, WA webhook, AOS, scrollspy, PWA) – 1 hari.
- Fase 4: Testing & optimasi (functional, responsif, Lighthouse, aksesibilitas) – 1–2 hari.

Catatan: Tetap pada stack saat ini (HTML/CSS/JS) demi efisiensi dan kompatibilitas; migrasi ke framework bisa direncanakan sebagai fase terpisah bila diperlukan. Apakah Anda menyetujui rencana ini? Setelah konfirmasi, saya mulai dari Fase 1 dan lanjut hingga siap produksi.