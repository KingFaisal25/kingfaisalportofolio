/* ============================================================
   STICKY CTA AUTO-HIDE (vanilla, no library)
   When the user reaches the contact section or the footer, the
   fixed "Konsultasi Gratis" bar slides away (body.cta-hidden, see
   styles/bottom-cta-mobile.css) so it never covers the form's
   submit button or the footer's last content. It slides back as
   soon as the user scrolls away.
   No IntersectionObserver -> do nothing (bar stays visible).
   ============================================================ */
(function () {
    'use strict';

    var contact = document.getElementById('contact');
    var footer = document.querySelector('.footer-modern');
    if (!contact && !footer) return;
    if (!('IntersectionObserver' in window)) return;

    var states = new Map();

    function apply() {
        var anyVisible = false;
        states.forEach(function (isVisible) {
            if (isVisible) anyVisible = true;
        });
        document.body.classList.toggle('cta-hidden', anyVisible);
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            states.set(entry.target, entry.isIntersecting);
        });
        apply();
    }, { threshold: 0.05 });

    if (contact) {
        states.set(contact, false);
        io.observe(contact);
    }
    if (footer) {
        states.set(footer, false);
        io.observe(footer);
    }
})();
