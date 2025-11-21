## Diagnosa Cepat
- Konfirmasi sumber error: berasal dari skrip live‑reload (fungsi `refreshCSS` di preview) sehingga bukan bug sintaks di aplikasi.
- Identifikasi faktor yang membuat halaman “tidak terlihat”: CSS/JS abort (ERR_ABORTED) → `body` tidak pernah beralih ke visible (mis. class `loaded` tidak ditambahkan) → halaman tetap `opacity:0`.
- Konsolidasikan server: gunakan XAMPP (`http://localhost/portofolio/portfolio-website/index.html`) dan hentikan preview lain (127.0.0.1:5500) agar `_cacheOverride` dan abort tidak terjadi.

## 1) Audit Performa
- Network panel: ukur TTFB dan respon server XAMPP; pastikan tidak ada redirect/404 berulang.
- Inventarisasi aset:
  - CSS/JS ukuran & jumlah permintaan; identifikasi aset besar/berulang.
  - Gambar: cek dimensi, `srcset/sizes`, `loading=lazy`, konversi ke WebP/AVIF bila mungkin.
- Fonts:
  - Pastikan `preconnect` ke Google Fonts; pertimbangkan self‑host subset Inter/Manrope untuk kestabilan.
- Caching:
  - Verifikasi service worker registrasi & cache aset inti; header caching untuk CSS/JS/gambar.

## 2) Audit Tampilan (Visibility)
- Pastikan `body` tidak bergantung pada JS untuk visible (hindari default `opacity:0`).
- Validasi overlay/z-index: header overlay tidak menutupi konten; periksa posisi fixed/absolute.
- Console: cek error runtime dari JS aplikasi (bukan live‑reload); perbaiki bila ada.
- Kompatibilitas: uji Chrome/Firefox/Safari/Edge di 320/768/1024/1440.

## 3) Solusi Implementasi
- Server & Preview:
  - Gunakan satu origin (XAMPP), nonaktifkan live‑reload; pastikan link CSS tanpa `_cacheOverride`.
- Visibility Safety:
  - Ubah strategi fade‑in: default `body` visible, tambahkan `.preload` di `<body>` lalu hapus saat `load`. Jika JS gagal, konten tetap terlihat.
  - Tambahkan fallback `noscript` agar konten tetap tampil bila JS nonaktif.
- Loading Indicator:
  - Tambah indicator ringan (skeleton/spinner) yang muncul saat `document.readyState!='complete'` dan sembunyikan saat `load`.
- Optimasi Performa:
  - LCP: preload hero image + `fetchpriority="high"` (sudah), pastikan dimensi eksplisit.
  - Gambar proyek: `srcset/sizes` (sudah), lazily loaded.
  - Fonts: kurangi weight, tambah `display=swap`, opsi self‑host untuk kestabilan offline.
  - Minifikasi CSS/JS (opsional) dan eliminasi yang tak terpakai.
- Caching & PWA:
  - Tambah runtime caching ringan untuk gambar statis di service worker; tetap pertahankan aset inti.

## 4) Pengujian Menyeluruh
- Network/Performance: cek waktu muat dan waterfall; jalankan Lighthouse (target ≥90).
- Visibility: pastikan halaman tampil tanpa bergantung pada JS; loader hilang saat `load`.
- Fungsional: navigasi/filter/modal/form/scrollspy/AOS berjalan; tidak ada error baru.
- Cross‑browser/device: validasi di 320/768/1024/1440.

## 5) Deliverables
- Perubahan kode untuk visibility safety (penggantian strategi `opacity`), loader, konsolidasi server, dan optimasi aset.
- Ringkasan hasil audit (temuan utama), laporan pengujian (Lighthouse, perangkat/browser), dan rekomendasi lanjutan (self‑host font, kompres gambar).

Setelah Anda menyetujui, saya akan menerapkan perubahan pada strategi visibility (preload→loaded), menambah loader ringan, mengkonsolidasikan server agar bebas dari log abort, serta mengoptimasi aset/caching lalu memverifikasi dengan pengujian menyeluruh.