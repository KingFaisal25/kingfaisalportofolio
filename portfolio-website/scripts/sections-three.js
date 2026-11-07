/**
 * Sections Showcase — Three.js + parallax for About / Services / Projects
 * - Canvas partikel Three.js di section Projects (pola sama seperti
 *   hero-three.js: guard, render hanya saat terlihat, pause saat tab
 *   tidak aktif / reduced motion (satu frame statis), pixelRatio dibatasi).
 * - Parallax orb: variabel --orb-x / --orb-y di-set per section saat scroll
 *   (rAF) + gerakan mouse halus (desktop, pointer halus saja).
 * - Aman bila CDN Three.js gagal: canvas dilewati, parallax tetap jalan;
 *   bila JS ini gagal total, section tetap tampil normal (CSS saja).
 */
(function () {
    'use strict';

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(pointer: fine)').matches;

    /* ================= CANVAS PARTIKEL PROJECTS ================= */
    function initProjectsCanvas() {
        var canvas = document.getElementById('projects-three-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        var section = canvas.closest('.projects-section');
        if (!section) return;

        var renderer;
        try {
            renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        } catch (e) {
            return; // WebGL tidak tersedia
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
        camera.position.set(0, 0, 10);

        /* --- Batas area partikel: ikut bentuk section saat load --- */
        var aspect = 1;
        try {
            var w = canvas.clientWidth || 1;
            var h = canvas.clientHeight || 1;
            aspect = w / h;
        } catch (e) { /* pakai default */ }
        var BOUND_X = 12;
        var BOUND_Y = aspect < 1 ? Math.min(16, 7 / Math.max(aspect, 0.35)) : 7;
        var BOUND_Z = 2;

        /* --- Partikel --- */
        var COUNT = 70;
        var positions = new Float32Array(COUNT * 3);
        var velocities = [];
        var i;
        for (i = 0; i < COUNT; i++) {
            positions[i * 3] = (Math.random() - 0.5) * BOUND_X * 2;
            positions[i * 3 + 1] = (Math.random() - 0.5) * BOUND_Y * 2;
            positions[i * 3 + 2] = (Math.random() - 0.5) * BOUND_Z * 2;
            velocities.push({
                x: (Math.random() - 0.5) * 0.1,
                y: (Math.random() - 0.5) * 0.1,
                z: (Math.random() - 0.5) * 0.04
            });
        }
        var pointsGeo = new THREE.BufferGeometry();
        pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        var points = new THREE.Points(pointsGeo, new THREE.PointsMaterial({
            size: 0.13,
            color: 0x90e0ef,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }));
        scene.add(points);

        /* --- Garis penghubung (buffer pre-allocated, drawRange per frame) --- */
        var MAX_PAIRS = COUNT * 8;
        var linePositions = new Float32Array(MAX_PAIRS * 6);
        var lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        var lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
            color: 0x00b4d8,
            transparent: true,
            opacity: 0.28,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }));
        scene.add(lines);
        var LINK_DIST = 2.4;
        var LINK_DIST_SQ = LINK_DIST * LINK_DIST;

        function resize() {
            var cw = canvas.clientWidth || 1;
            var ch = canvas.clientHeight || 1;
            renderer.setSize(cw, ch, false);
            camera.aspect = cw / ch;
            camera.updateProjectionMatrix();
        }
        resize();
        window.addEventListener('resize', resize);

        /* --- Parallax mouse: kamera bergeser halus mengikuti kursor --- */
        var mouseX = 0, mouseY = 0;
        var hasMouse = false;
        if (!reducedMotion && finePointer) {
            section.addEventListener('mousemove', function (e) {
                var r = section.getBoundingClientRect();
                if (!r.width || !r.height) return;
                mouseX = ((e.clientX - r.left) / r.width - 0.5) * 2;
                mouseY = ((e.clientY - r.top) / r.height - 0.5) * 2;
                hasMouse = true;
            });
            section.addEventListener('mouseleave', function () {
                hasMouse = false;
            });
        }

        var visible = true;
        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                visible = entries[0] ? entries[0].isIntersecting : true;
            }, { threshold: 0 });
            io.observe(section);
        }

        function renderFrame() {
            var p, a, b, dx, dy, dz, d2, pairCount = 0;
            for (p = 0; p < COUNT; p++) {
                positions[p * 3] += velocities[p].x;
                positions[p * 3 + 1] += velocities[p].y;
                positions[p * 3 + 2] += velocities[p].z;
                if (positions[p * 3] > BOUND_X || positions[p * 3] < -BOUND_X) velocities[p].x *= -1;
                if (positions[p * 3 + 1] > BOUND_Y || positions[p * 3 + 1] < -BOUND_Y) velocities[p].y *= -1;
                if (positions[p * 3 + 2] > BOUND_Z || positions[p * 3 + 2] < -BOUND_Z) velocities[p].z *= -1;
            }
            pointsGeo.attributes.position.needsUpdate = true;

            for (a = 0; a < COUNT && pairCount < MAX_PAIRS; a++) {
                for (b = a + 1; b < COUNT && pairCount < MAX_PAIRS; b++) {
                    dx = positions[a * 3] - positions[b * 3];
                    dy = positions[a * 3 + 1] - positions[b * 3 + 1];
                    dz = positions[a * 3 + 2] - positions[b * 3 + 2];
                    d2 = dx * dx + dy * dy + dz * dz;
                    if (d2 < LINK_DIST_SQ) {
                        linePositions[pairCount * 6] = positions[a * 3];
                        linePositions[pairCount * 6 + 1] = positions[a * 3 + 1];
                        linePositions[pairCount * 6 + 2] = positions[a * 3 + 2];
                        linePositions[pairCount * 6 + 3] = positions[b * 3];
                        linePositions[pairCount * 6 + 4] = positions[b * 3 + 1];
                        linePositions[pairCount * 6 + 5] = positions[b * 3 + 2];
                        pairCount++;
                    }
                }
            }
            lineGeo.setDrawRange(0, pairCount * 2);
            lineGeo.attributes.position.needsUpdate = true;

            if (hasMouse) {
                camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.05;
                camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
            } else {
                camera.position.x += (0 - camera.position.x) * 0.05;
                camera.position.y += (0 - camera.position.y) * 0.05;
            }
            camera.lookAt(0, 0, 0);
            renderer.render(scene, camera);
        }

        if (reducedMotion) {
            renderFrame(); // satu frame statis, lalu berhenti
            return;
        }

        var rafId = null;
        function loop() {
            rafId = null;
            if (visible && !document.hidden) renderFrame();
            rafId = requestAnimationFrame(loop);
        }
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden && rafId === null) rafId = requestAnimationFrame(loop);
        });
        rafId = requestAnimationFrame(loop);
    }

    /* ================= PARALLAX ORB (scroll + mouse) ================= */
    function initOrbParallax() {
        if (reducedMotion) return;

        var sections = [];
        ['about', 'services', 'projects'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) sections.push(el);
        });
        if (!sections.length) return;

        var ticking = false;
        var mouseNX = 0;
        var hasMouse = false;

        function apply() {
            ticking = false;
            var vh = window.innerHeight || 1;
            var i, sec, r, offset, y;
            for (i = 0; i < sections.length; i++) {
                sec = sections[i];
                r = sec.getBoundingClientRect();
                if (r.bottom < 0 || r.top > vh) continue;
                offset = (r.top + r.height / 2 - vh / 2) / vh;
                y = Math.max(-70, Math.min(70, offset * 90));
                sec.style.setProperty('--orb-y', y.toFixed(1) + 'px');
            }
            if (hasMouse) {
                for (i = 0; i < sections.length; i++) {
                    sections[i].style.setProperty('--orb-x', (mouseNX * 10).toFixed(1) + 'px');
                }
            }
        }

        function requestTick() {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(apply);
            }
        }

        window.addEventListener('scroll', requestTick, { passive: true });
        window.addEventListener('resize', requestTick);

        if (finePointer) {
            document.addEventListener('mousemove', function (e) {
                var w = window.innerWidth || 1;
                mouseNX = (e.clientX / w - 0.5) * 2;
                hasMouse = true;
                requestTick();
            }, { passive: true });
        }

        requestTick();
    }

    /* Script ini defer: DOM sudah siap. THREE juga defer & dimuat lebih dulu,
       tapi tetap dijaga bila CDN gagal (initProjectsCanvas return diam-diam). */
    try {
        initProjectsCanvas();
    } catch (e) { /* canvas dilewati, section tetap tampil */ }
    try {
        initOrbParallax();
    } catch (e) { /* parallax dilewati */ }
})();
