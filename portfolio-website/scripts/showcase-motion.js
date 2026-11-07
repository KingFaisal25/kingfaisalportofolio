/**
 * Showcase Motion System
 * - Cursor glow (desktop, pointer halus).
 * - Tombol magnetik: hero CTA + sticky CTA.
 * - Tilt 3D saat hover pada kartu Projek & Layanan.
 * - Lightbox preview untuk tombol "Lihat" projek (href="#") — menampilkan
 *   screenshot + deskripsi + tech dari kartu itu sendiri. Tombol "Kode"
 *   sengaja tidak diubah (butuh URL repo asli dari pemilik).
 * Semua efek dimatikan bila reduced motion / perangkat sentuh.
 */
(function () {
    'use strict';

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(pointer: fine)').matches;
    var enabled = !reducedMotion && finePointer;

    /* ============ CURSOR GLOW ============ */
    function initCursorGlow() {
        if (!enabled) return;
        var glow = document.createElement('div');
        glow.id = 'cursor-glow';
        glow.setAttribute('aria-hidden', 'true');
        document.body.appendChild(glow);

        var x = -400, y = -400, tx = -400, ty = -400, shown = false, rafId = null;

        function loop() {
            rafId = null;
            x += (tx - x) * 0.12;
            y += (ty - y) * 0.12;
            glow.style.transform = 'translate3d(' + (x - 160) + 'px,' + (y - 160) + 'px,0)';
            if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) {
                rafId = requestAnimationFrame(loop);
            }
        }

        document.addEventListener('mousemove', function (e) {
            tx = e.clientX;
            ty = e.clientY;
            if (!shown) { shown = true; glow.classList.add('on'); }
            if (rafId === null) rafId = requestAnimationFrame(loop);
        });
        document.documentElement.addEventListener('mouseleave', function () {
            shown = false;
            glow.classList.remove('on');
        });
    }

    /* ============ MAGNETIC BUTTONS ============ */
    function initMagnetic() {
        if (!enabled) return;
        var btns = document.querySelectorAll('.hero-actions a, .sticky-cta-btn');
        btns.forEach(function (btn) {
            btn.classList.add('magnetic');
            btn.addEventListener('mousemove', function (e) {
                var r = btn.getBoundingClientRect();
                var dx = e.clientX - (r.left + r.width / 2);
                var dy = e.clientY - (r.top + r.height / 2);
                btn.style.translate = (dx * 0.22).toFixed(1) + 'px ' + (dy * 0.28).toFixed(1) + 'px';
            });
            btn.addEventListener('mouseleave', function () {
                btn.style.translate = '';
            });
        });
    }

    /* ============ CARD TILT (Projek & Layanan) ============ */
    function initTilt() {
        if (!enabled) return;
        var cards = document.querySelectorAll('.project-card, .service-card');
        cards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var r = card.getBoundingClientRect();
                var px = (e.clientX - r.left) / r.width - 0.5;
                var py = (e.clientY - r.top) / r.height - 0.5;
                card.style.setProperty('--ry', (px * 9).toFixed(2) + 'deg');
                card.style.setProperty('--rx', (-py * 7).toFixed(2) + 'deg');
            });
            card.addEventListener('mouseleave', function () {
                card.style.setProperty('--rx', '0deg');
                card.style.setProperty('--ry', '0deg');
            });
        });
    }

    /* ============ LIGHTBOX PREVIEW PROJEK ============ */
    function initLightbox() {
        var overlay = document.createElement('div');
        overlay.className = 'showcase-lightbox';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Preview projek');
        overlay.innerHTML =
            '<figure>' +
            '<button type="button" class="showcase-lightbox-close" aria-label="Tutup">\u00d7</button>' +
            '<img alt="">' +
            '<figcaption><h3></h3><p></p><div class="lightbox-tags"></div></figcaption>' +
            '</figure>';
        document.body.appendChild(overlay);

        var img = overlay.querySelector('img');
        var title = overlay.querySelector('h3');
        var desc = overlay.querySelector('p');
        var tags = overlay.querySelector('.lightbox-tags');
        var closeBtn = overlay.querySelector('.showcase-lightbox-close');
        var lastFocus = null;

        function open(card, trigger) {
            var cardImg = card.querySelector('.project-image-container img, .project-card img, img');
            var cardTitle = card.querySelector('.project-title');
            var cardDesc = card.querySelector('.project-description');
            if (!cardImg) return;
            img.src = cardImg.currentSrc || cardImg.src;
            img.alt = cardImg.alt || (cardTitle ? cardTitle.textContent.trim() : 'Preview projek');
            title.textContent = cardTitle ? cardTitle.textContent.trim() : '';
            desc.textContent = cardDesc ? cardDesc.textContent.trim().replace(/\s+/g, ' ') : '';
            tags.innerHTML = '';
            card.querySelectorAll('.tech-tag').forEach(function (t) {
                var s = document.createElement('span');
                s.textContent = t.textContent.trim();
                tags.appendChild(s);
            });
            lastFocus = trigger || null;
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        }

        function close() {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
            if (lastFocus && lastFocus.focus) lastFocus.focus();
            lastFocus = null;
        }

        document.addEventListener('click', function (e) {
            var btn = e.target.closest('.project-card a.btn-outline[href="#"]');
            if (btn) {
                e.preventDefault();
                open(btn.closest('.project-card'), btn);
            }
        });
        closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) close();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('open')) close();
        });
    }

    /* ============ INIT ============ */
    function boot() {
        initCursorGlow();
        initMagnetic();
        initTilt();
        initLightbox();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
