## Tujuan
- Menghilangkan error `SyntaxError: missing ) after argument list` sehingga situs berjalan normal.
- Memodernisasi UI/UX: layout bersih, warna kontemporer, tipografi mudah dibaca, animasi halus.
- Optimasi performa (LCP, CLS, interaksi) dan kompatibilitas lintas browser/perangkat.

## 1) Diagnosa Error
- Tangkap stack trace lengkap di Console untuk mengetahui file, baris, dan kolom sumber error.
- Audit blok script yang baru: `test-comprehensive.html` dan `scripts/main.js` (template literals, inline event handlers, fungsi dengan argumen).
- Cari pola raw yang sering memicu kesalahan:
  - Template literal tidak menutup `${ ... }` atau tanda kurung `)` di dalam expression.
  - Inline `onclick`/handler dengan tanda kutip/koma/kurung tidak berpasangan.
  - Sintaks modern yang tidak didukung (optional chaining `?.` atau `??`) di lingkungan preview tertentu.
- Gunakan pencarian lintas file untuk baris mencurigakan (mis. backtick bertumpuk di `renderTests()` yang menanam HTML dalam template string).

## 2) Perbaikan Sintaks & Kompatibilitas
- Jika sumber di `test-comprehensive.html`:
  - Pastikan semua template literal menutup dengan benar; pecah nested template menjadi string terpisah bila perlu.
  - Hindari optional chaining pada ekspresi yang di-evaluate sebagai boolean; ganti dengan guards eksplisit.
  - Validasi inline event attributes (mis. `onclick="..."`) dan escape tanda kutip/kurung.
- Jika sumber di `scripts/main.js`:
  - Pastikan semua `setTimeout(() => {...}, ms)` dan callback tidak kehilangan kurung/kurawal.
  - Ganti optional chaining pada DOM API dengan null-check aman agar kompatibel lintas browser.
- Tambahkan linting rules lokal (ESLint config minimal) untuk menangkap kesalahan bracket/parentheses.

## 3) Penguatan Pengujian
- Perbaiki dan jalankan `test-comprehensive.html`:
  - Koreksi tes yang memakai variabel CSS yang tidak ada (mis. `--primary-900`) agar memeriksa token yang memang tersedia.
  - Uji DOM availability untuk elemen yang memang ada (sesuaikan id). 
- Tambahkan uji interaksi dasar: buka modal proyek, filter kategori, submit form (mock), toggle menu, scrollspy aktif.
- Verifikasi AOS terinisialisasi dan menghormati `prefers-reduced-motion`.

## 4) Optimasi Performa
- LCP: pertahankan preload gambar hero dan `fetchpriority="high"`; pastikan ukuran eksplisit.
- Gambar proyek: gunakan `srcset/sizes` (sudah diterapkan) dan cek dimensi untuk mencegah CLS.
- Font: preconnect dan, bila perlu, preload font heading; kurangi blocking.
- PWA: validasi service worker & manifest; aktifkan caching ringan untuk asset statis.

## 5) UI/UX Modern
- Layout: tegakkan grid 12 kolom, spacing 24/48px, container 1440px.
- Warna: konsisten dengan `--brand` untuk aksen; pastikan kontras ≥4.5:1.
- Tipografi: Manrope (heading) dan Inter (body) dengan ukuran responsif via `clamp()`.
- Animasi: AOS untuk masuk, micro-interactions di nav/CTA, page transition opacity 300ms.

## 6) Kompatibilitas
- Cross-browser: Chrome, Firefox, Safari, Edge.
- Breakpoints: 320/768/1024/1440; uji overlap/overflow dengan grid & flex.
- Aksesibilitas: fokus visible, ARIA pada nav/modal, alt text, reduced-motion.

## 7) Deliverables
- Perbaikan kode untuk menghilangkan SyntaxError (baris/file teridentifikasi di Console).
- Pembaruan script/test agar kompatibel dan bebas error.
- Laporan pengujian (hasil `test-comprehensive`, lintas perangkat/browser, ringkasan Lighthouse).

## Konfirmasi
- Setelah Anda menyetujui rencana ini, saya akan mulai dari diagnosa error di Console, lakukan perbaikan sintaks yang diperlukan, lalu lanjutkan pengujian dan optimasi performa/UX secara bertahap.