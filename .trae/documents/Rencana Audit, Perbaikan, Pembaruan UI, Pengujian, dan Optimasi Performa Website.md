## Tujuan
- Mengaudit seluruh halaman/komponen untuk menemukan area pembaruan visual dan error.
- Memperbaiki error yang mengganggu fungsionalitas inti.
- Mendesain ulang antarmuka agar modern, konsisten, dan responsif.
- Melakukan pengujian menyeluruh lintas perangkat/browser.
- Mengoptimalkan performa (kecepatan, LCP/CLS/FID) sebelum peluncuran ulang.

## 1) Audit Menyeluruh
- Pemetaan halaman/komponen: Header/Hero, Navigasi, About, Skills, Experience, Certifications, Projects (filter + modal), Testimonials, Services, Consultation/AI, Contact, Footer, PWA (manifest/SW), aset gambar/font, test suite (`test-comprehensive.html`).
- Inventarisasi masalah: kumpulkan semua pesan error di Console (file:baris), cek warning Lighthouse, audit aksesibilitas (kontras, aria, fokus).
- Checklist konsistensi: warna (brand), tipografi (heading/body), spacing (24/48/64px), grid (12 kolom), animasi (AOS, micro-interaction), kompatibilitas.

## 2) Perbaikan Error Sistematis
- Tinjau dan perbaiki SyntaxError/ReferenceError/TypeError satu per satu berdasarkan stack trace.
- Rapikan test suite: hapus optional chaining yang tidak kompatibel, sesuaikan id/variabel dengan implementasi aktual.
- Validasi integrasi: AOS init, service worker registrasi, manifest link, WhatsApp webhook fallback.
- Pastikan semua event handler aman dengan null-check dan tidak memicu crash.

## 3) Pembaruan Tampilan (UI/UX)
- Sistem visual: tegakkan design tokens (warna brand, spacing, radius, shadow, font), palet monokrom dengan aksen brand.
- Layout: grid 12 kolom + container 1440px, spacing vertikal 48px antar section utama, 24px antar subsection.
- Tipografi: Manrope (heading) + Inter (body) dengan skala responsif via `clamp()`.
- Navigasi: struktur minimalis 5–7 item, CTA jelas, hover underline gradien, overlay mobile dengan blur.
- Projects: kartu + modal detail konsisten, filter kategori, animasi AOS yang halus.
- Micro-interactions: transisi 300ms pada elemen klik/CTA, fokus-visible untuk aksesibilitas.

## 4) Pengujian Menyeluruh
- Functional: navigasi, filter, modal, form, scrollspy, theme toggle (bila aktif), top button.
- Cross-browser: Chrome/Firefox/Safari/Edge.
- Cross-device: 320/768/1024/1440 px; cek overlap/overflow di semua breakpoint.
- Lighthouse: target ≥90 di Performance/Accessibility/Best Practices/SEO.
- Aksesibilitas: aria/kontras/fokus/reduced-motion.
- Test suite: jalankan `test-comprehensive.html`, koreksi hasil yang gagal.

## 5) Optimasi Performa
- LCP: preload + `fetchpriority="high"` untuk hero, dimensi eksplisit untuk mencegah CLS.
- Gambar proyek: `srcset/sizes`, lazy loading, kompresi lossless untuk aset final.
- Font: preconnect (dan preload jika perlu), kurangi blocking render.
- PWA: pastikan cache aset inti, fallback offline dasar; minimalkan bloat JS/CSS.
- Minifikasi dan eliminasi CSS/JS yang tidak dipakai (opsional).

## 6) Deliverables
- Daftar error dan perbaikannya (file:baris, deskripsi, solusi).
- Kode UI/UX diperbarui dengan design tokens dan layout grid.
- Hasil pengujian (report ringkas): lintas perangkat/browser, Lighthouse.
- Rekomendasi lanjutan (mis. integrasi CMS, analytics) bila dibutuhkan.

## Alur Eksekusi
1. Audit + kumpulkan error dari Console/Lighthouse.
2. Perbaiki error prioritas tinggi yang memblokir fungsi inti.
3. Terapkan pembaruan UI sistematis (tokens, grid, navigasi, projects, micro-interactions).
4. Jalankan pengujian menyeluruh; iterasi perbaikan.
5. Optimasi performa; finalisasi sebelum peluncuran.

Setelah Anda menyetujui rencana ini, saya akan mulai dari audit dan perbaikan error, dilanjutkan pembaruan UI dan pengujian hingga siap diluncurkan ulang.