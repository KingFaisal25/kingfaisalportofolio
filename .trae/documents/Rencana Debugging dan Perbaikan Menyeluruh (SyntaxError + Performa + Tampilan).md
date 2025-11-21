## Tujuan
- Mengidentifikasi dan menghapus akar error `SyntaxError: missing ) after argument list` (berasal dari injeksi live‑reload) agar situs tampil normal.
- Mengoptimalkan performa loading dan memastikan tampilan konsisten di semua perangkat/browser.
- Menyediakan laporan lengkap: penyebab, perbaikan, hasil uji.

## 1) Remote Debugging & Identifikasi Akar Masalah
- Konsolidasi origin uji: gunakan XAMPP (`http://localhost/portofolio/portfolio-website/index.html`) dan hentikan preview Live Server (127.0.0.1:5500) agar injeksi `refreshCSS` tidak terjadi.
- Buka DevTools:
  - Tab Console: tangkap stack trace untuk SyntaxError (pastikan bukan berasal dari kode aplikasi) dan catat semua error/warning.
  - Tab Network: analisis waterfall untuk melihat `ERR_ABORTED` dan resource yang gagal; cek TTFB/response server.
- Dokumentasikan log dan screenshot tampilan bermasalah untuk laporan.

## 2) Pemeriksaan Konektivitas & Konfigurasi Server
- Verifikasi konektivitas jaringan lokal terhadap CDN (Google Fonts, Font Awesome, AOS).
- Pastikan hanya satu server berjalan; nonaktifkan alat yang meng‑inject `_cacheOverride` agar resource tidak ter‑abort.
- Cek konfigurasi XAMPP: izin akses file, tipe mime CSS/JS, cache header dasar.

## 3) Verifikasi Status Aplikasi & Service
- Pastikan service worker terdaftar tanpa error; cek manifest link.
- Validasi tidak ada error runtime dari `scripts/main.js` (null‑check tersedia).
- Konfirmasi AOS terinisialisasi dan menghormati `prefers-reduced-motion`.

## 4) Perbaikan Fungsional & Tampilan
- Visibility safety: pastikan `body` visible secara default; hindari strategi yang membuat halaman `opacity:0` tanpa fallback.
- Stabilkan pemuatan CSS/JS:
  - Susun `<link>` tanpa `_cacheOverride` dan dengan `preconnect` yang benar.
  - Siapkan fallback lokal untuk Font Awesome/AOS bila CDN terkendala.
- Tambahkan loading indicator ringan (spinner/skeleton) yang hilang saat `window.load`.
- Perbaiki struktur HTML/CSS yang berpotensi menutupi konten (overlay/z-index/position).

## 5) Optimasi Performa
- Gambar: konfirmasi `srcset/sizes` dan `loading=lazy`; gunakan WebP/AVIF jika aset final tersedia; dimensi eksplisit untuk mencegah CLS.
- LCP: pastikan preload + `fetchpriority="high"` pada hero image.
- Fonts: `preconnect` dan `display=swap`; pertimbangkan self‑host subset untuk stabilitas.
- PWA: tambah runtime caching ringan untuk gambar statis dan verifikasi cache aset inti.

## 6) Pembaruan Komponen
- Dependency libraries:
  - Gunakan CDN stabil (jsDelivr/unpkg) plus `integrity`/`crossorigin` dan fallback lokal.
- Framework/konten/aset:
  - Selaraskan design tokens warna/spacing/typography; konsistensi lintas halaman.
  - Kompres gambar lossless; minimalkan CSS/JS tidak terpakai (opsional).

## 7) Pengujian Menyeluruh
- Functional: navigasi, filter proyek, modal, form, scrollspy, AOS, PWA.
- Cross‑browser/device: Chrome/Firefox/Safari/Edge dan resolusi 320/768/1024/1440.
- Lighthouse: target ≥90 untuk Accessibility/Best Practices/SEO; iterasi performa jika perlu.
- Laporan: kumpulkan log lengkap, screenshot, hasil uji, dan ringkasan perubahan.

Setelah Anda menyetujui, saya akan mulai dengan konsolidasi server dan audit DevTools (Console/Network), kemudian menerapkan perbaikan visibilitas, stabilisasi resource, optimasi performa, menambahkan loader, dan menyusun laporan detail hasil pengujian.