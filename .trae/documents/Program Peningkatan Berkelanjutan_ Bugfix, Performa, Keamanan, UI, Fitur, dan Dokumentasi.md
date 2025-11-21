## Sasaran Utama
- Melakukan peningkatan menyeluruh secara proaktif dan berkelanjutan tanpa menunggu permintaan spesifik.
- Menjaga kualitas sistem: bebas bug, performa tinggi, aman, antarmuka profesional, fitur lengkap, dokumentasi rapi.

## Ruang Lingkup & Prioritas
- Tingkat prioritas: kritikal (bug/keamanan) → performa → UX/UI → fitur pendukung → dokumentasi.
- Rilis bertahap: patch kecil cepat untuk kritikal, fitur/UI dalam sprint mingguan, dokumentasi menyusul setiap perubahan.

## 1) Perbaikan Bug
- Audit Console & Network: tangkap error/warning; koreksi selector, null‑check, kompatibilitas (hindari optional chaining pada env terbatas).
- Uji fungsional: navigasi, filter proyek, modal, form (validasi, honeypot, CAPTCHA, WA webhook), scrollspy, animasi AOS.
- Test suite: selaraskan kasus uji (DOM, desain, responsif, performa, aksesibilitas, teknis); pastikan tidak ada SyntaxError dari environment eksternal.

## 2) Optimasi Performa
- LCP/CLS/FID:
  - LCP: preload + `fetchpriority="high"` gambar hero; dimensi eksplisit.
  - Gambar: `srcset/sizes`, lazy load, kompresi lossless; opsi WebP/AVIF.
  - Fonts: `preconnect`, `display=swap`; opsi self‑host subset untuk stabilitas.
- CSS/JS:
  - Eliminasi CSS tak terpakai (purge/minify bila layak), optimisasi AOS; defer non‑kritikal.
- PWA:
  - Cache aset inti, runtime caching ringan untuk gambar statis.

## 3) Peningkatan Keamanan
- Header keamanan (bila di server): CSP dasar, X‑Content‑Type‑Options, Referrer‑Policy, Strict‑Transport‑Security.
- Service worker: audit cache, hindari cache data sensitif.
- Form: honeypot & CAPTCHA, sanitasi input sebelum dikirim ke webhook.
- CDN keamanan: gunakan SRI (`integrity`) + `crossorigin` untuk FA/AOS bila pakai CDN, fallback lokal.

## 4) Penyempurnaan UI/UX
- Design tokens: warna brand, spacing 8px, radius, shadow, typography konsisten.
- Grid 12 kolom + container 1440px, breakpoints: 320/768/1024/1440.
- Navigasi: minimalis 5–7 item, CTA jelas, overlay mobile dengan blur, scrollspy.
- Animasi: AOS untuk masuk yang halus, micro‑interactions (hover, focus-visible), menghormati `prefers-reduced-motion`.
- Komponen: Hero (foto profil), Services, Projects (kartu + modal + filter), Testimonials, Contact, Consultation/AI, Footer.
- Loading indicator: overlay spinner saat load, skeleton ringan untuk gambar proyek.

## 5) Penambahan Fitur Pendukung
- SEO: meta og/twitter, canonical, sitemap.xml, robots.txt, structured data (JSON‑LD person/organization/project).
- Aksesibilitas: ARIA lengkap, kontras WCAG 2.1 AA, keyboard‑friendly, alt deskriptif.
- Analytics & Error Tracking (opsional): GA4/Plausible, Sentry untuk front‑end.
- Blog (opsional): halaman artikel teknis, integrasi CMS headless jika diperlukan.

## 6) Dokumentasi
- Style Guide: palet, tipografi, grid, komponen, aturan foto profil, aksesibilitas, performa.
- Changelog: catat setiap modifikasi (tanggal, file, ringkasan, alasan, dampak).
- Readme pengembangan: cara build/serve, struktur folder, praktik deploy.

## 7) Pengujian & Validasi
- Cross‑browser: Chrome/Firefox/Safari/Edge.
- Cross‑device: 320/768/1024/1440; cek overlap/overflow.
- Lighthouse: target ≥90 untuk Accessibility/Best Practices/SEO; iterasi pada Performance.
- Test suite internal: jalankan `test-comprehensive.html` setelah setiap iterasi.

## 8) Operasional & Dampak Sistem
- Semua perubahan mempertimbangkan kompatibilitas dan tidak memutus fitur existing.
- Rollout aman: rilis kecil, verifikasi, lalu rilis lanjut.
- Backout plan: setiap perubahan besar disertai langkah rollback.

## 9) Jadwal Eksekusi
- Minggu 1: Audit menyeluruh + perbaikan bug/keamanan kritikal, stabilisasi pemuatan resource.
- Minggu 2: Optimasi performa (gambar, font, PWA) + penyempurnaan UI/UX inti.
- Minggu 3: Fitur pendukung (SEO, aksesibilitas, loader/skeleton) + dokumentasi.
- Minggu 4: Pengujian komprehensif + hardening + laporan akhir; siapkan launching.

## Konfirmasi
- Jika disetujui, saya akan mulai dari audit (Console/Network/Lighthouse), lakukan perbaikan bug/performa/keamanan prioritas, kemudian lanjutkan penyempurnaan UI/UX dan fitur pendukung, disertai dokumentasi dan pengujian hingga siap produksi.