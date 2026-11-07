/* ============================================================
   CONTACT SHOWCASE — Three.js ambient canvas + GSAP micro-motion
   - Three.js: particle field + 2 wireframe shapes behind the
     contact section (same guarded pattern as testimonials-three.js).
   - GSAP: 3D tilt on the form card (desktop hover), submit-button
     press, progress-fill glow pulse when the fill width updates.
   - Fully guarded: no THREE -> no canvas; no gsap -> no motion;
     prefers-reduced-motion -> one static frame, no tilt.
   - Does NOT touch validation/submit logic (contact-form-*.js).
   ============================================================ */
(function () {
    'use strict';

    var section = document.getElementById('contact');
    var form = document.getElementById('contactForm');
    if (!section || !form) return;

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Three.js ambient canvas ---------- */
    (function initContactThree() {
        var canvas = document.getElementById('contact-three-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
        camera.position.z = 9;

        function sizeToSection() {
            var w = section.clientWidth || 1;
            var h = section.clientHeight || 1;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
        sizeToSection();

        // Particle field
        var count = 110;
        var positions = new Float32Array(count * 3);
        for (var i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 16;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
        }
        var geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        var points = new THREE.Points(geo, new THREE.PointsMaterial({
            color: 0x67e8f9, size: 0.055, transparent: true, opacity: 0.65
        }));
        scene.add(points);

        // Two wireframe shapes — cyan icosahedron + violet torus
        var ico = new THREE.Mesh(
            new THREE.IcosahedronGeometry(1.5, 0),
            new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.28 })
        );
        ico.position.set(-4.6, 1.4, -1);
        scene.add(ico);

        var torus = new THREE.Mesh(
            new THREE.TorusGeometry(1.1, 0.05, 12, 48),
            new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.3 })
        );
        torus.position.set(4.8, -1.2, -1.5);
        scene.add(torus);

        // Mouse parallax (desktop only)
        var mx = 0, my = 0;
        if (window.matchMedia('(hover: hover)').matches) {
            section.addEventListener('mousemove', function (e) {
                var r = section.getBoundingClientRect();
                mx = (e.clientX - r.left) / r.width - 0.5;
                my = (e.clientY - r.top) / r.height - 0.5;
            });
            section.addEventListener('mouseleave', function () { mx = 0; my = 0; });
        }

        var visible = true;
        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                visible = !!(entries[0] && entries[0].isIntersecting);
            }, { threshold: 0.02 });
            io.observe(section);
        }

        var t = 0;
        function draw() {
            t += 0.0035;
            points.rotation.y = t * 0.35 + mx * 0.15;
            points.rotation.x = my * 0.1;
            ico.rotation.x = t * 0.5;
            ico.rotation.y = t * 0.7;
            torus.rotation.x = t * 0.4;
            torus.rotation.y = t * 0.55;
            camera.position.x += (mx * 0.6 - camera.position.x) * 0.04;
            camera.position.y += (-my * 0.4 - camera.position.y) * 0.04;
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        }

        window.addEventListener('resize', sizeToSection);

        // Reduced motion: one static frame, no loop
        if (reducedMotion) { draw(); return; }

        (function loop() {
            requestAnimationFrame(loop);
            if (visible) draw();
        })();
    })();

    /* ---------- GSAP micro-interactions ---------- */
    if (typeof window.gsap === 'undefined') return;
    var gsap = window.gsap;

    // 3D tilt on the form card (desktop, fine pointer only)
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (finePointer && !reducedMotion) {
        gsap.set(form, { transformPerspective: 900 });
        var rotX = gsap.quickTo(form, 'rotationX', { duration: 0.5, ease: 'power3.out' });
        var rotY = gsap.quickTo(form, 'rotationY', { duration: 0.5, ease: 'power3.out' });
        var lift = gsap.quickTo(form, 'y', { duration: 0.5, ease: 'power3.out' });
        form.addEventListener('mousemove', function (e) {
            var r = form.getBoundingClientRect();
            var px = (e.clientX - r.left) / r.width - 0.5;
            var py = (e.clientY - r.top) / r.height - 0.5;
            rotX(py * -4);
            rotY(px * 5);
            lift(-4);
        });
        form.addEventListener('mouseleave', function () {
            rotX(0);
            rotY(0);
            lift(0);
        });
    }

    // Submit button press
    var btn = form.querySelector('.btn-submit');
    if (btn) {
        btn.addEventListener('mousedown', function () {
            gsap.fromTo(btn, { scale: 0.97 }, {
                scale: 1,
                duration: 0.4,
                ease: 'back.out(2)',
                onComplete: function () { gsap.set(btn, { clearProps: 'transform' }); }
            });
        });
    }

    // Progress bar glow pulse when the fill width updates
    // (validation JS sets style.width; we only animate the glow)
    var fill = form.querySelector('.progress-fill');
    if (fill && window.MutationObserver) {
        var mo = new MutationObserver(function () {
            gsap.fromTo(fill,
                { boxShadow: '0 0 18px rgba(0, 212, 255, 0.9)' },
                { boxShadow: '0 0 12px rgba(0, 212, 255, 0.5)', duration: 0.7, ease: 'power2.out' });
        });
        mo.observe(fill, { attributes: true, attributeFilter: ['style'] });
    }
})();
