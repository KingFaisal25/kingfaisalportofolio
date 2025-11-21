## Tujuan
Memperbarui section Skills agar kartu Tech Stack tidak terasa sempit ketika konten bertambah, tetap rapi, modern dan responsif.

## Perubahan Utama (CSS)
1) Grid Tech Stack
- Ubah `.tech-stack` menjadi auto-fit agar jumlah kolom menyesuaikan lebar layar:
  - `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))`
  - `grid-auto-flow: row dense`
  - `gap: var(--space-xl)`
- Breakpoints:
  - Mobile: 1 kolom (tetap)
  - Tablet: auto-fit dengan min 300–320px
  - Desktop: auto-fit dengan min 320px
2) Kartu `.tech-category`
- Pastikan kontainer mengikuti isi:
  - `min-width: 0; max-width: 100%; min-height: auto;`
  - `padding: var(--space-xl)` (mobile turun ke `var(--space-lg)`)
  - `display: grid; gap: var(--space-md)` agar heading+desc tersusun rapi
- Tambah varian untuk konten panjang:
  - `.tech-category--wide { grid-column: span 2 }` aktif pada desktop saja
3) Teks & Overflow
- Pastikan wrapping aman:
  - `.tech-description { overflow-wrap: anywhere; hyphens: auto; line-height: 1.6 }`
- Judul responsif:
  - `.tech-title { font-weight: 700; letter-spacing: .3px; font-size: clamp(1.125rem, 2.2vw, 1.5rem) }`
4) Konsistensi Spacing
- Internal spacing minimal 16px untuk hierarki jelas:
  - `.tech-category > * + * { margin-top: 16px }`

## Perubahan HTML (index.html)
- Terapkan `.tech-category--wide` pada kategori dengan isi lebih panjang.
- Tambahkan blok “Core Skills & Proficiency” yang sudah ada sebagai referensi progres.
- Jika diperlukan, tambahkan sub-list (bullet/inline tags) di masing-masing kategori agar konten tetap scanable.

## Interaksi
- Hover halus dan aksen pseudo-element tetap aktif.
- Animasi progres bar tetap mengandalkan AOS/IO fallback.

## Responsivitas & Pengujian
- Viewport: 320 / 768 / 1024 / 1280 / 1440.
- Cross-browser: Chrome, Firefox ESR, Safari, Edge.
- Verifikasi: tidak ada clipping, horizontal scroll, atau overlap.

## Implementasi File
- `styles/main-optimized.css` (blok `.tech-stack` sekitar 2704–2718; blok `.tech-category` sekitar 2847–2860; penambahan `.tech-category--wide`)
- `index.html` (menandai kategori panjang dengan `tech-category--wide` bila perlu)

Jika disetujui, saya akan langsung menerapkan perubahan CSS/HTML di atas dan menyesuaikan kategori yang kontennya panjang agar tampil lebar dan tetap rapi.