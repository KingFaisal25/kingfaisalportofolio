/* ============================================================
   FOOTER THREE — ambient canvas + scroll parallax (footer only)
   - Particles + 2 wireframe shapes behind the footer content,
     same guarded pattern as testimonials-three.js /
     contact-showcase.js: no THREE -> skip; IntersectionObserver
     pause when the footer is off-screen; prefers-reduced-motion
     -> one static frame, no loop.
   - PARALLAX: as the footer scrolls through the viewport, the
     camera and the particle field drift with the scroll progress
     (0 = footer just entering, 1 = footer leaving), plus mouse
     parallax on desktop.
   - Touches nothing outside the footer. No GSAP, no site-wide lib.
   ============================================================ */
(function () {
    'use strict';

    var footer = document.querySelector('.footer-modern');
    if (!footer) return;

    var canvas = document.getElementById('footer-three-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 9;

    function sizeToFooter() {
        var w = footer.clientWidth || 1;
        var h = footer.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    sizeToFooter();

    // Particle field (cyan + violet mix via two point clouds)
    function makePoints(color, count, size, opacity) {
        var positions = new Float32Array(count * 3);
        for (var i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 16;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
        }
        var geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        var points = new THREE.Points(geo, new THREE.PointsMaterial({
            color: color, size: size, transparent: true, opacity: opacity
        }));
        scene.add(points);
        return points;
    }
    var pointsCyan = makePoints(0x67e8f9, 60, 0.055, 0.65);
    var pointsViolet = makePoints(0xa78bfa, 40, 0.045, 0.55);

    // Two wireframe shapes — cyan icosahedron + violet torus
    var ico = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.4, 0),
        new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.25 })
    );
    ico.position.set(-4.8, 1.2, -1);
    scene.add(ico);

    var torus = new THREE.Mesh(
        new THREE.TorusGeometry(1.0, 0.05, 12, 48),
        new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.28 })
    );
    torus.position.set(4.9, -1.0, -1.5);
    scene.add(torus);

    // Mouse parallax (desktop only)
    var mx = 0, my = 0;
    if (window.matchMedia('(hover: hover)').matches) {
        footer.addEventListener('mousemove', function (e) {
            var r = footer.getBoundingClientRect();
            mx = (e.clientX - r.left) / r.width - 0.5;
            my = (e.clientY - r.top) / r.height - 0.5;
        });
        footer.addEventListener('mouseleave', function () { mx = 0; my = 0; });
    }

    var visible = true;
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            visible = !!(entries[0] && entries[0].isIntersecting);
        }, { threshold: 0.02 });
        io.observe(footer);
    }

    // Scroll parallax progress: 0 when the footer just enters the
    // viewport, 1 when it is about to leave it.
    function scrollProgress() {
        var rect = footer.getBoundingClientRect();
        var vh = window.innerHeight || 1;
        var p = (vh - rect.top) / (vh + rect.height);
        if (p < 0) p = 0;
        if (p > 1) p = 1;
        return p;
    }

    var t = 0;
    function draw() {
        t += 0.0035;
        var p = scrollProgress();
        // Parallax: camera drifts down and the field slowly rotates
        // as the footer scrolls through the viewport.
        pointsCyan.rotation.y = t * 0.3 + p * 0.8 + mx * 0.15;
        pointsCyan.rotation.x = my * 0.1;
        pointsViolet.rotation.y = -t * 0.22 + p * 0.6 + mx * 0.12;
        pointsViolet.rotation.x = -my * 0.08;
        ico.rotation.x = t * 0.5;
        ico.rotation.y = t * 0.7 + p * 0.5;
        torus.rotation.x = t * 0.4;
        torus.rotation.y = t * 0.55 + p * 0.4;
        camera.position.x += (mx * 0.6 - camera.position.x) * 0.04;
        camera.position.y += ((p - 0.5) * 1.4 - my * 0.4 - camera.position.y) * 0.04;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', sizeToFooter);

    // Reduced motion: one static frame, no loop
    if (reducedMotion) { draw(); return; }

    (function loop() {
        requestAnimationFrame(loop);
        if (visible) draw();
    })();
})();
