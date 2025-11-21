## Tujuan
- Menciptakan tampilan modern, profesional, konsisten dengan brand persona.
- Meningkatkan performa (Lighthouse >90), aksesibilitas, dan engagement.
- Menyediakan sistem visual dan panduan implementasi yang skalabel.

## 1) Audit Konten & Analisis
- Inventarisasi seluruh elemen halaman: hero, navigasi, sections (About, Skills, Experience, Certifications, Projects, Testimonials, Services, Contact, Footer), aset gambar/video, dan skrip.
- Klasifikasi konten: pertahankan (konten relevan, performa baik), perbaiki (microcopy, struktur, visual), hapus (redundan/ tidak berdampak).
- Prioritasi berdasarkan tujuan bisnis (konversi layanan, kontak) dan engagement (klik CTA, waktu baca).
- Identifikasi area foto profil: rekomendasi penempatan utama di Hero (kolom kanan) dan sekunder di About (kartu profil dengan caption). 
- Output: Dokumen audit (daftar konten, status, prioritas) + rekomendasi struktur baru.

## 2) Redesain Sistem Visual Terpadu
- Palet warna (1 primer, 2 sekunder, 1 aksen):
  - Primer: #0A192F (Midnight Navy)
  - Sekunder 1: #1E3A8A (Indigo)
  - Sekunder 2: #334155 (Slate)
  - Aksen: #64FFDA (Mint)
- Tipografi (2 font utama):
  - Heading: Manrope (600/700) – keterbacaan tinggi & modern
  - Body: Inter (400/500/600) – sudah digunakan, nyaman dibaca
- Grid system: 8px base (scale: 4, 8, 12, 16, 24, 32, 40, 48, 64)
- Design tokens (CSS variables): warna, spacer, radius (4/8/12), shadows, z-index, typography scale.
- Komponen modular: Navbar, Hero (teks + foto profil), Service Card, Project Card, Modal, CTA Button, Testimonial Card, Footer.
- Wireframe foto profil:
  - Hero: layout 2 kolom (teks kiri, foto profil kanan – potret berbentuk lingkaran/rounded, caption: nama + jabatan), tombol CTA jelas.
  - About: kartu profil dengan foto + caption + poin ringkas peran/keahlian.
- Output: Palet, spesifikasi tipografi, token, library komponen, wireframe.

## 3) Penyempurnaan Konten Strategis
- Rewrite teks: tone profesional, ramah, fokus hasil; bahasa Indonesia konsisten.
- Optimasi microcopy: CTA berorientasi aksi (mis. "Konsultasi Gratis", "Diskusikan Kebutuhan"); deskripsi ringkas bernilai bisnis.
- Hierarki konten dengan F-pattern: headline kuat, subheading informatif, poin fitur, CTA; kurangi blok teks panjang.
- Area foto profil: caption profesional (nama, jabatan, sertifikasi kunci).
- Output: Dokumen naskah baru (hero, services, projects, about, contact) siap implementasi.

## 4) Implementasi Teknis
- HTML5 semantik: `header`, `nav`, `main`, `section`, `article`, `footer`; ARIA untuk aksesibilitas.
- CSS modern: Flexbox/Grid; responsif di 5 breakpoint (320/768/1024/1440/1920).
- Design tokens: terapkan di `:root` untuk konsistensi; utility classes minimal untuk spacing/typography.
- Optimasi gambar: kompresi lossless, gunakan `srcset/sizes`, `loading=lazy`, alt text deskriptif; khusus foto profil siapkan versi desktop/mobile.
- Performance: preload/preconnect font, inline critical CSS (opsional), defer JS non-kritis.
- Style guide: dokumentasi komponen, palet, tipografi, grid, aturan foto profil & caption (dokumen terpisah).
- PWA: pertahankan SW & manifest; tambahkan runtime caching ringan untuk gambar statis.
- Output: Kode HTML/CSS/JS diperbarui + berkas style guide.

## 5) Testing Komprehensif
- Cross-browser: Chrome, Firefox, Safari, Edge (versi terbaru).
- Responsif: uji 320, 768, 1024, 1440, 1920 px.
- Lighthouse: target >90 untuk Performance/Accessibility/Best Practices/SEO; perbaiki blocking resources, ukuran gambar, aria/contrast.
- User testing: 5+ peserta; skenario (menemukan layanan, melihat projek, menghubungi); kumpulkan feedback.
- Analytics (opsional): integrasi GA4/Plausible untuk memantau bounce rate, engagement (CTA click, time on page).
- Output: Laporan pengujian + perbaikan.

## Kriteria Keberhasilan & Metrik
- Bounce rate turun ≥30% (dipantau 2–4 minggu pasca rilis).
- Waktu loading <2s di 3G (Lighthouse + WebPageTest); TTI & LCP optimal.
- Konsistensi visual di semua halaman (audit token & komponen).
- Penempatan foto profil natural, meningkatkan interaksi (scroll depth, klik CTA dekat hero).
- Engagement naik ≥25% (klik CTA, submit form, view projek).

## Rencana Implementasi (Fase)
- Fase 1: Audit & konten (1–2 hari) – inventaris, klasifikasi, naskah.
- Fase 2: Sistem visual (1–2 hari) – token, palet, tipografi, wireframe, komponen dasar.
- Fase 3: Implementasi UI (2–3 hari) – Hero baru (foto profil), Services, Projects, Testimonials, Footer.
- Fase 4: Optimasi performa & aksesibilitas (1 hari) – gambar, font, aria, reduced-motion.
- Fase 5: Testing & iterasi (1–2 hari) – cross-browser, responsif, Lighthouse, user testing.

## Deliverables
- Kode HTML/CSS/JS yang terstruktur dengan design tokens.
- Style guide dokumentasi (komponen, palet, tipografi, grid, foto profil).
- Aset gambar profil & proyek teroptimasi dengan `srcset`.
- Laporan pengujian (Lighthouse, kompatibilitas, responsif, user testing).

## Catatan Teknis
- Tetap pada stack saat ini (HTML/CSS/JS) untuk efisiensi; migrasi ke framework (React/Vue/Tailwind) dapat direncanakan sebagai fase terpisah bila diperlukan.
- Tidak ada perubahan SEO yang berisiko; hanya memperkuat metadata dan semantik.
- Performa dijaga dengan pengurangan blocking dan caching PWA.

Apakah Anda menyetujui rencana ini? Setelah konfirmasi, saya akan mulai dari Fase 1 (audit) dan menyampaikan hasilnya sebelum lanjut ke implementasi visual.