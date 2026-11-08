/* Conversion showcase — dibuat 2026-11-08, ronde 2/3/4/5.
   Hanya untuk section baru/baru-direstyle di ronde ini:
   - count-up angka stats (.stat-count)
   - parallax orbs (.stats-orb / .process-orb)
   - TIDAK ADA canvas Three.js baru di ronde ini (sengaja dilepas 2026-11-08:
     7 konteks WebGL sekaligus bikin tab iPhone Safari crash-reload pas scroll).
     Efek 3D di section baru hanya orbs parallax + glass + tilt (CSS/JS ringan).
   - tilt 3D kartu testimoni (.testimonial-marquee-card)
   Semua guarded + menghormati prefers-reduced-motion.
   Tidak menyentuh kode section lain. */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Stats count-up ---------- */
    var counters = document.querySelectorAll('.stat-count[data-target]');

    function animateCount(el) {
        var target = parseInt(el.getAttribute('data-target'), 10) || 0;
        if (reduceMotion) {
            el.textContent = target;
            return;
        }
        var start = null;
        var dur = 1300;
        function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased);
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    if (counters.length) {
        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCount(entry.target);
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });
            counters.forEach(function (el) { io.observe(el); });
        } else {
            counters.forEach(animateCount);
        }
    }

    /* ---------- Parallax orbs ---------- */
    var orbs = document.querySelectorAll('.stats-orb, .process-orb');
    if (!reduceMotion && orbs.length) {
        var ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                var vh = window.innerHeight || 800;
                orbs.forEach(function (orb) {
                    var parent = orb.parentElement;
                    if (!parent) return;
                    var rect = parent.getBoundingClientRect();
                    if (rect.bottom < 0 || rect.top > vh) return;
                    var progress = (vh - rect.top) / (vh + rect.height);
                    var dir = (orb.classList.contains('stats-orb-2') || orb.classList.contains('process-orb-2')) ? -1 : 1;
                    orb.style.transform = 'translateY(' + ((progress - 0.5) * 60 * dir).toFixed(1) + 'px)';
                });
                ticking = false;
            });
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------- Testimonial card tilt (mouse saja) ---------- */
    if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.testimonial-marquee-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var r = card.getBoundingClientRect();
                if (!r.width || !r.height) return;
                var x = (e.clientX - r.left) / r.width - 0.5;
                var y = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform = 'perspective(900px) rotateY(' + (x * 8).toFixed(2) +
                    'deg) rotateX(' + (-y * 8).toFixed(2) + 'deg) translateY(-4px)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }
})();
