/* Skills Showcase — dibuat 2026-11-08, ronde Skills "paling front-end banget".
   Hanya untuk .skills-showcase:
   - tab demo live (HTML / CSS / JavaScript / React)
   - animasi bar keahlian saat masuk viewport
   - filter kategori bento grid
   - demo live: counter JS + tombol like React (state)
   - tilt 3D kartu (mouse saja)
   Vanilla, tanpa WebGL. Semua guarded + prefers-reduced-motion dihormati.
   Tidak menyentuh kode section lain. */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Tab demo live ---------- */
    var tabs = document.querySelectorAll('.skills-tab[data-tab]');
    var panels = document.querySelectorAll('.skills-panel[data-panel]');

    function fillPanelBars(panel) {
        if (!panel) return;
        panel.querySelectorAll('.skills-bar-fill').forEach(function (fill) {
            fill.classList.add('filled');
        });
    }

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            var target = tab.getAttribute('data-tab');
            tabs.forEach(function (t) {
                t.classList.toggle('active', t === tab);
                t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
            });
            panels.forEach(function (panel) {
                var isTarget = panel.getAttribute('data-panel') === target;
                panel.classList.toggle('active', isTarget);
                if (isTarget) fillPanelBars(panel);
            });
        });
    });

    /* ---------- Bar keahlian: isi saat terlihat ---------- */
    var fills = document.querySelectorAll('.skills-bar-fill');
    if (fills.length) {
        if (reduceMotion) {
            fills.forEach(function (fill) { fill.classList.add('filled'); });
        } else if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('filled');
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });
            fills.forEach(function (fill) { io.observe(fill); });
        } else {
            fills.forEach(function (fill) { fill.classList.add('filled'); });
        }
    }

    /* ---------- Filter kategori ---------- */
    var filterBtns = document.querySelectorAll('.skills-filter[data-filter]');
    var cards = document.querySelectorAll('.skills-card[data-cat]');
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var filter = btn.getAttribute('data-filter');
            filterBtns.forEach(function (b) { b.classList.toggle('active', b === btn); });
            cards.forEach(function (card) {
                var show = filter === 'all' || card.getAttribute('data-cat') === filter;
                card.classList.toggle('hide', !show);
                if (show) {
                    card.classList.remove('show-in');
                    void card.offsetWidth;
                    card.classList.add('show-in');
                }
            });
        });
    });

    /* ---------- Demo live: counter JavaScript ---------- */
    var counterValue = document.getElementById('skills-js-count');
    document.querySelectorAll('.skills-counter-btn[data-count-action]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (!counterValue) return;
            var current = parseInt(counterValue.textContent, 10) || 0;
            var next = btn.getAttribute('data-count-action') === 'inc' ? current + 1 : current - 1;
            counterValue.textContent = next;
        });
    });

    /* ---------- Demo live: tombol like React (state) ---------- */
    var likeBtn = document.getElementById('skills-react-like');
    var likeCount = document.getElementById('skills-react-count');
    if (likeBtn && likeCount) {
        likeBtn.addEventListener('click', function () {
            var liked = likeBtn.classList.toggle('liked');
            var current = parseInt(likeCount.textContent, 10) || 0;
            likeCount.textContent = liked ? current + 1 : Math.max(current - 1, 0);
            likeBtn.setAttribute('aria-pressed', liked ? 'true' : 'false');
        });
    }

    /* ---------- Tilt 3D kartu (mouse saja) ---------- */
    if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.skills-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var r = card.getBoundingClientRect();
                if (!r.width || !r.height) return;
                var x = (e.clientX - r.left) / r.width - 0.5;
                var y = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform = 'perspective(800px) rotateY(' + (x * 6).toFixed(2) +
                    'deg) rotateX(' + (-y * 6).toFixed(2) + 'deg) translateY(-4px)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }
})();
