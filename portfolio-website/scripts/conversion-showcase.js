/* Conversion showcase — dibuat 2026-11-08, ronde 2/3/4/5.
   Hanya untuk section baru/baru-direstyle di ronde ini:
   - count-up angka stats (.stat-count)
   - parallax orbs (.stats-orb / .process-orb)
   - particle field Three.js untuk #stats-three-canvas + #process-three-canvas
     (Three.js r128 sudah dimuat global; guarded kalau CDN gagal)
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

    /* ---------- Three.js particle fields ---------- */
    function particleField(canvasId, count) {
        var canvas = document.getElementById(canvasId);
        if (!canvas || typeof THREE === 'undefined') return;

        var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
        camera.position.z = 6;

        var geo = new THREE.BufferGeometry();
        var pos = new Float32Array(count * 3);
        var col = new Float32Array(count * 3);
        var c1 = new THREE.Color(0x00d4ff);
        var c2 = new THREE.Color(0x8b5cf6);
        for (var i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 12;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
            var c = Math.random() > 0.5 ? c1 : c2;
            col[i * 3] = c.r;
            col[i * 3 + 1] = c.g;
            col[i * 3 + 2] = c.b;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        var mat = new THREE.PointsMaterial({ size: 0.08, vertexColors: true, transparent: true, opacity: 0.8 });
        var points = new THREE.Points(geo, mat);
        scene.add(points);

        function resize() {
            var w = canvas.clientWidth || (canvas.parentElement && canvas.parentElement.clientWidth) || 0;
            var h = canvas.clientHeight || (canvas.parentElement && canvas.parentElement.clientHeight) || 0;
            if (!w || !h) return;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
        resize();
        window.addEventListener('resize', resize);

        if (reduceMotion) {
            renderer.render(scene, camera);
            return;
        }

        var visible = false;
        var raf = null;
        function tick() {
            raf = null;
            if (!visible) return;
            points.rotation.y += 0.0009;
            points.rotation.x += 0.0004;
            renderer.render(scene, camera);
            raf = requestAnimationFrame(tick);
        }
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    visible = entry.isIntersecting;
                    if (visible && !raf) tick();
                });
            }, { threshold: 0 }).observe(canvas);
        } else {
            visible = true;
            tick();
        }
    }

    particleField('stats-three-canvas', 60);
    particleField('process-three-canvas', 50);

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
