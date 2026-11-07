/* ============================================================
   STICKY CTA AUTO-HIDE + TAP-TO-CONTACT (vanilla, no library)
   - Bar "Konsultasi Gratis" menghilang saat pengguna sampai di
     section kontak atau footer (IntersectionObserver), supaya
     tidak menutupi tombol Kirim Pesan / isi footer.
   - Fallback scroll: kalau IO tidak sempat jalan, bar juga
     disembunyikan saat posisi sudah dekat dasar halaman.
   - Ketuk tombol bar -> gulir halus ke #contact.
   ============================================================ */
(function () {
    'use strict';

    var contact = document.getElementById('contact');
    var footer = document.querySelector('.footer-modern');
    var barBtn = document.querySelector('.sticky-cta-btn');

    // Ketuk tombol bar -> gulir halus ke form kontak.
    if (barBtn && contact) {
        barBtn.addEventListener('click', function (e) {
            e.preventDefault();
            contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    if (!contact && !footer) return;

    var ioHidden = false;

    function nearBottom() {
        var doc = document.documentElement;
        return (window.innerHeight + window.scrollY) >= (doc.scrollHeight - 120);
    }

    function applyHidden() {
        document.body.classList.toggle('cta-hidden', ioHidden || nearBottom());
    }

    if ('IntersectionObserver' in window) {
        var states = new Map();
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                states.set(entry.target, entry.isIntersecting);
            });
            ioHidden = false;
            states.forEach(function (v) { if (v) ioHidden = true; });
            applyHidden();
        }, { threshold: 0.05 });
        if (contact) { states.set(contact, false); io.observe(contact); }
        if (footer) { states.set(footer, false); io.observe(footer); }
    }

    // Fallback: cek ulang saat scroll (throttle ringan).
    var ticking = false;
    window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
            applyHidden();
            ticking = false;
        });
    }, { passive: true });
})();
