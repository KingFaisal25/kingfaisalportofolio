/**
 * Hero — Three.js interactive particle network
 * - Jaringan partikel yang saling terhubung garis, bereaksi pada kursor
 *   (partikel menjauh halus dari posisi mouse).
 * - Aman bila CDN Three.js gagal: semua dibungkus guard, hero tetap
 *   tampil normal. Hemat resource: render hanya saat hero terlihat,
 *   berhenti saat tab tidak aktif / reduced motion (satu frame statis).
 */
(function () {
    'use strict';

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function init() {
        var canvas = document.getElementById('hero-three-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        var section = canvas.closest('.hero-section');
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

        /* --- Partikel --- */
        var COUNT = 90;
        var BOUND_X = 11, BOUND_Y = 5.2, BOUND_Z = 2;
        var positions = new Float32Array(COUNT * 3);
        var velocities = [];
        for (var i = 0; i < COUNT; i++) {
            positions[i * 3] = (Math.random() - 0.5) * BOUND_X * 2;
            positions[i * 3 + 1] = (Math.random() - 0.5) * BOUND_Y * 2;
            positions[i * 3 + 2] = (Math.random() - 0.5) * BOUND_Z * 2;
            velocities.push({
                x: (Math.random() - 0.5) * 0.12,
                y: (Math.random() - 0.5) * 0.12,
                z: (Math.random() - 0.5) * 0.05
            });
        }
        var pointsGeo = new THREE.BufferGeometry();
        pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        var points = new THREE.Points(pointsGeo, new THREE.PointsMaterial({
            size: 0.14,
            color: 0x90e0ef,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }));
        scene.add(points);

        /* --- Garis penghubung (LineSegments, buffer pre-allocated) --- */
        var MAX_LINES = (COUNT * (COUNT - 1)) / 2;
        var linePositions = new Float32Array(MAX_LINES * 6);
        var linesGeo = new THREE.BufferGeometry();
        linesGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        var lines = new THREE.LineSegments(linesGeo, new THREE.LineBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.28,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }));
        scene.add(lines);
        var LINK_DIST = 3.1;

        /* --- Mouse (world coords pada bidang z=0) --- */
        var mouse = { x: 9999, y: 9999, active: false };
        var finePointer = window.matchMedia('(pointer: fine)').matches;
        if (finePointer && !reducedMotion) {
            section.addEventListener('mousemove', function (e) {
                var r = section.getBoundingClientRect();
                var nx = ((e.clientX - r.left) / r.width) * 2 - 1;
                var ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
                var h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
                mouse.x = nx * (h * camera.aspect) / 2;
                mouse.y = ny * h / 2;
                mouse.active = true;
            });
            section.addEventListener('mouseleave', function () { mouse.active = false; });
        }

        /* --- Resize --- */
        function resize() {
            var w = section.clientWidth || 1;
            var h = section.clientHeight || 1;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
        resize();
        window.addEventListener('resize', resize);

        /* --- Frame --- */
        var clock = new THREE.Clock();
        function step() {
            var dt = Math.min(clock.getDelta(), 0.05);
            var t = clock.elapsedTime;

            for (var i = 0; i < COUNT; i++) {
                var ix = i * 3;
                // drift pelan
                positions[ix] += velocities[i].x * dt * 8;
                positions[ix + 1] += velocities[i].y * dt * 8;
                positions[ix + 2] += velocities[i].z * dt * 8;
                // pantul di batas
                if (positions[ix] > BOUND_X || positions[ix] < -BOUND_X) velocities[i].x *= -1;
                if (positions[ix + 1] > BOUND_Y || positions[ix + 1] < -BOUND_Y) velocities[i].y *= -1;
                if (positions[ix + 2] > BOUND_Z || positions[ix + 2] < -BOUND_Z) velocities[i].z *= -1;
                // tolak halus dari kursor
                if (mouse.active) {
                    var dx = positions[ix] - mouse.x;
                    var dy = positions[ix + 1] - mouse.y;
                    var d2 = dx * dx + dy * dy;
                    if (d2 < 4.8 && d2 > 0.0001) {
                        var d = Math.sqrt(d2);
                        var push = (2.2 - d) * 0.06;
                        positions[ix] += (dx / d) * push;
                        positions[ix + 1] += (dy / d) * push;
                    }
                }
            }
            pointsGeo.attributes.position.needsUpdate = true;

            // garis antar partikel dekat
            var li = 0;
            for (var a = 0; a < COUNT; a++) {
                for (var b = a + 1; b < COUNT; b++) {
                    var ax = positions[a * 3], ay = positions[a * 3 + 1], az = positions[a * 3 + 2];
                    var bx = positions[b * 3], by = positions[b * 3 + 1], bz = positions[b * 3 + 2];
                    var ddx = ax - bx, ddy = ay - by, ddz = az - bz;
                    if (ddx * ddx + ddy * ddy + ddz * ddz < LINK_DIST * LINK_DIST) {
                        linePositions[li++] = ax; linePositions[li++] = ay; linePositions[li++] = az;
                        linePositions[li++] = bx; linePositions[li++] = by; linePositions[li++] = bz;
                    }
                }
            }
            linesGeo.setDrawRange(0, li / 3);
            linesGeo.attributes.position.needsUpdate = true;

            // goyang halus + parallax kamera
            points.rotation.y = Math.sin(t * 0.05) * 0.06;
            lines.rotation.y = points.rotation.y;
            camera.position.x += ((mouse.active ? mouse.x * 0.08 : 0) - camera.position.x) * 0.03;
            camera.position.y += ((mouse.active ? mouse.y * 0.08 : 0) - camera.position.y) * 0.03;
            camera.lookAt(0, 0, 0);
            renderer.render(scene, camera);
        }

        /* --- Loop: hanya saat terlihat --- */
        var visible = true;
        var running = false;
        var rafId = null;

        function loop() {
            rafId = null;
            if (!visible || document.hidden) { running = false; return; }
            running = true;
            step();
            rafId = requestAnimationFrame(loop);
        }

        function start() {
            if (running || rafId !== null) return;
            if (reducedMotion) { step(); return; } // satu frame statis
            clock.getDelta();
            rafId = requestAnimationFrame(loop);
        }

        function stop() {
            if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
            running = false;
        }

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                visible = entries[0].isIntersecting;
                if (visible) start(); else stop();
            }, { threshold: 0.02 }).observe(section);
        }
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) stop(); else if (visible) start();
        });
        start();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
