## Tujuan
- Membersihkan elemen/komponen/kode yang tidak diperlukan agar struktur ringan dan optimal.
- Menjaga fitur esensial tetap berfungsi, tampilan konsisten di semua perangkat, dan performa cepat.
- Melakukan pengujian menyeluruh lintas browser, lalu deployment setelah lolos verifikasi.

## 1) Audit & Pembersihan
- Inventaris file/folder: tandai yang esensial vs non‑esensial.
- Hapus dari build/deploy: halaman uji (`test-comprehensive.html`, `test-functionality.html`), aset demo/placeholder, script eksperimen yang tidak dipakai, komentar berlebih.
- Konsolidasikan CSS/JS: gabungkan style terpakai, buang kelas/variabel tidak digunakan, pertahankan design tokens inti.
- Tinjau dependensi CDN: pertahankan FA/AOS dan font jika dipakai; siapkan fallback lokal bila diperlukan.

## 2) Optimasi Struktur & Dependencies
- Struktur folder disederhanakan: `index.html`, `styles/main.css`, `scripts/main.js`, `src/assets (images/fonts)`, `service-worker.js`, `manifest.json`.
- Pastikan link dan import konsisten dan tanpa duplikasi.
- Fonts: preconnect + display=swap; pertimbangkan subset/self-host bila diperlukan uji performa.
- Gambar: pastikan `srcset/sizes`, `loading=lazy`, dimensi eksplisit; kompres lossless.

## 3) Verifikasi Fungsional
- Fitur esensial: navigasi (desktop/mobile), filter proyek, modal detail, form kontak (validasi, honeypot, CAPTCHA, WA webhook/fallback), scrollspy, AOS animasi, PWA (SW+manifest).
- Aksesibilitas: ARIA untuk nav/modal, focus-visible, alt teks, kontras sesuai WCAG.

## 4) Pengujian Menyeluruh
- Cross‑browser: Chrome, Firefox, Safari + Edge untuk referensi.
- Cross‑device: 320/768/1024/1440; cek overlap/overflow, konsistensi tipografi dan grid.
- Lighthouse: target ≥90 untuk Accessibility/Best Practices/SEO; ukur Performance, iterasi bila perlu.
- Link checker: pastikan semua tautan internal/eksternal berfungsi dan aman (`rel="noopener noreferrer"`).

## 5) Performa & Stabilitas
- LCP: preload + fetchpriority tinggi untuk hero.
- PWA: cache core assets (HTML/CSS/JS) + runtime caching ringan untuk gambar/style/script origin sama; fallback navigasi saat offline.
- Minimasi CSS/JS tidak terpakai; pastikan tanpa error Console.

## 6) Deployment
- Build ringan: hanya file esensial; pastikan path benar dan referensi aset stabil.
- Deployment ke hosting pilihan (VPS/Netlify/Vercel/XAMPP produksi) dengan konfigurasi caching dasar.
- Post‑deploy: smoke test lintas browser/perangkat; cek ulang log & performa.

## 7) Output & Dokumentasi
- Daftar file dihapus/diubah, ringkasan optimasi, hasil pengujian (browser/device/Lighthouse), dan catatan kompatibilitas.
- Style guide singkat tetap dipertahankan untuk konsistensi visual.

Setelah Anda menyetujui, saya akan mengeksekusi pembersihan dan optimalisasi, menjalankan pengujian menyeluruh, lalu melakukan deployment dan konfirmasi bahwa website berjalan sempurna.