/**
 * Testimonials — Three.js background + 3D card tilt
 * - Canvas partikel + wireframe di belakang section testimoni.
 * - Tilt 3D pada kartu mengikuti posisi kursor (delegasi, jadi tetap
 *   jalan untuk kartu hasil klon marquee).
 * - Aman bila CDN Three.js gagal: semua dibungkus guard, halaman tetap
 *   tampil normal tanpa canvas. Hemat resource: render hanya saat
 *   section terlihat, berhenti saat tab tidak aktif / reduced motion.
 */
(function () {
    'use strict';

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(pointer: fine)').matches;

    /* ============ THREE.JS BACKGROUND ============ */
    function initThree() {
        var canvas = document.getElementById('testimonial-three-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        var section = canvas.closest('.testimonial-marquee-section');
        if (!section) return;

        var renderer;
        try {
            renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        } catch (e) {
            return; // WebGL tidak tersedia — biarkan section tampil tanpa canvas
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
        camera.position.set(0, 0, 9);

        /* --- Partikel mengambang (cyan / putih / ungu) --- */
        var COUNT = 170;
        var positions = new Float32Array(COUNT * 3);
        var colors = new Float32Array(COUNT * 3);
        var palette = [new THREE.Color(0x90e0ef), new THREE.Color(0xffffff), new THREE.Color(0xa78bfa)];
        for (var i = 0; i < COUNT; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 22;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
            var c = palette[i % palette.length];
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }
        var geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        var points = new THREE.Points(geo, new THREE.PointsMaterial({
            size: 0.09,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }));
        scene.add(points);

        /* --- 3 wireframe icosahedron, rotasi pelan --- */
        var shapes = [];
        var shapeDefs = [
            { color: 0x00b4d8, pos: [-7.5, 1.4, -2.5], size: 1.5 },
            { color: 0x8b5cf6, pos: [7.5, -1.2, -3.5], size: 1.9 },
            { color: 0x10b981, pos: [0.5, 2.4, -5], size: 1.1 }
        ];
        shapeDefs.forEach(function (def) {
            var mesh = new THREE.Mesh(
                new THREE.IcosahedronGeometry(def.size, 0),
                new THREE.MeshBasicMaterial({ color: def.color, wireframe: true, transparent: true, opacity: 0.30 })
            );
            mesh.position.set(def.pos[0], def.pos[1], def.pos[2]);
            scene.add(mesh);
            shapes.push(mesh);
        });

        /* --- Resize mengikuti section --- */
        function resize() {
            var w = section.clientWidth || 1;
            var h = section.clientHeight || 1;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
        resize();
        window.addEventListener('resize', resize);

        /* --- Parallax halus mengikuti kursor --- */
        var targetX = 0, targetY = 0;
        if (finePointer && !reducedMotion) {
            section.addEventListener('mousemove', function (e) {
                var r = section.getBoundingClientRect();
                targetX = ((e.clientX - r.left) / r.width - 0.5) * 0.8;
                targetY = ((e.clientY - r.top) / r.height - 0.5) * 0.5;
            });
            section.addEventListener('mouseleave', function () { targetX = 0; targetY = 0; });
        }

        /* --- Render loop: hanya saat terlihat --- */
        var clock = new THREE.Clock();
        var visible = true;
        var running = false;
        var rafId = null;

        function render() {
            var t = clock.getElapsedTime();
            points.rotation.y = t * 0.02;
            points.position.y = Math.sin(t * 0.3) * 0.15;
            shapes.forEach(function (mesh, idx) {
                mesh.rotation.x = t * (0.12 + idx * 0.04);
                mesh.rotation.y = t * (0.15 + idx * 0.03);
            });
            camera.position.x += (targetX - camera.position.x) * 0.04;
            camera.position.y += (-targetY - camera.position.y) * 0.04;
            camera.lookAt(0, 0, 0);
            renderer.render(scene, camera);
        }

        function loop() {
            rafId = null;
            if (!visible || document.hidden) { running = false; return; }
            running = true;
            render();
            rafId = requestAnimationFrame(loop);
        }

        function start() {
            if (running || rafId !== null) return;
            if (reducedMotion) { render(); return; } // satu frame statis saja
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
            }, { threshold: 0.05 }).observe(section);
        }
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) stop(); else if (visible) start();
        });
        start();
    }

    /* ============ 3D CARD TILT (delegasi) ============ */
    function initTilt() {
        if (reducedMotion || !finePointer) return;
        var container = document.querySelector('.testimonial-marquee-container');
        if (!container) return;

        var current = null;
        var rafId = null;
        var pending = null;

        function apply() {
            rafId = null;
            if (!current || !pending) return;
            var r = current.getBoundingClientRect();
            var px = (pending.x - r.left) / r.width - 0.5;
            var py = (pending.y - r.top) / r.height - 0.5;
            current.style.setProperty('--ry', (px * 10).toFixed(2) + 'deg');
            current.style.setProperty('--rx', (-py * 8).toFixed(2) + 'deg');
        }

        container.addEventListener('mousemove', function (e) {
            var card = e.target.closest('.testimonial-marquee-card');
            if (!card) return;
            if (card !== current) {
                reset(current);
                current = card;
            }
            pending = { x: e.clientX, y: e.clientY };
            if (rafId === null) rafId = requestAnimationFrame(apply);
        });

        function reset(card) {
            if (!card) return;
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
        }

        container.addEventListener('mouseleave', function () {
            reset(current);
            current = null;
            pending = null;
        });
    }

    /* ============ INIT ============ */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { initThree(); initTilt(); });
    } else {
        initThree();
        initTilt();
    }
})();
