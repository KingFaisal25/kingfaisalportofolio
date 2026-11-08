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

/* ---------- Animasi lanjutan (2026-11-08, ronde "makin keren") ----------
   IIFE kedua, listener terpisah (tidak mengubah IIFE pertama):
   - count-up angka % saat bar terlihat / tab dibuka
   - spotlight: posisi kursor -> --mx/--my di browser + kartu
   - code typing: bungkus baris kode + replay tiap ganti tab
   - tilt halus jendela browser (mouse saja) */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ----- Count-up angka % ----- */
    function animateLevel(el) {
        if (!el || el.dataset.counted) return;
        el.dataset.counted = 'true';
        var target = parseInt(el.textContent, 10) || 0;
        if (reduceMotion) {
            el.textContent = target + '%';
            return;
        }
        var start = null;
        var dur = 1100;
        function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + '%';
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    var levels = document.querySelectorAll('.skills-card-level, .skills-panel-info .skills-level');
    if (levels.length && 'IntersectionObserver' in window && !reduceMotion) {
        var lio = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateLevel(entry.target);
                    lio.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        levels.forEach(function (el) { lio.observe(el); });
    }

    /* ----- Code typing: bungkus baris + replay ----- */
    function setupTyping(code) {
        if (!code || code.dataset.typed) return;
        code.dataset.typed = 'true';
        var lines = code.innerHTML.split('\n');
        code.innerHTML = lines.map(function (line, i) {
            return '<span class="code-line" style="animation-delay:' + (i * 110) + 'ms">' + (line || ' ') + '</span>';
        }).join('\n') + '<span class="code-caret" aria-hidden="true"></span>';
    }

    function replayTyping(panel) {
        if (!panel) return;
        var code = panel.querySelector('.skills-code');
        if (!code) return;
        setupTyping(code);
        code.classList.remove('typing');
        void code.offsetWidth;
        code.classList.add('typing');
        /* Angka % di panel ikut kehitung lewat IntersectionObserver
           (panel yang baru tampil otomatis ter-intersect). */
    }

    document.querySelectorAll('.skills-code').forEach(setupTyping);
    /* Typing panel pertama jalan saat browser mockup pertama kali terlihat,
       bukan saat load — biar efeknya tidak habis sebelum di-scroll. */
    var browserEl = document.querySelector('.skills-browser');
    var firstPanel = document.querySelector('.skills-panel.active');
    function startFirstTyping() {
        if (!firstPanel) return;
        var firstCode = firstPanel.querySelector('.skills-code');
        if (firstCode) firstCode.classList.add('typing');
    }
    if (browserEl && 'IntersectionObserver' in window) {
        var bio = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    startFirstTyping();
                    bio.disconnect();
                }
            });
        }, { threshold: 0.25 });
        bio.observe(browserEl);
    } else {
        startFirstTyping();
    }
    document.querySelectorAll('.skills-tab[data-tab]').forEach(function (tab) {
        tab.addEventListener('click', function () {
            var panel = document.querySelector('.skills-panel[data-panel="' + tab.getAttribute('data-tab') + '"]');
            replayTyping(panel);
        });
    });

    /* ----- Spotlight ngikutin kursor ----- */
    function addSpotlight(el) {
        el.addEventListener('mousemove', function (e) {
            var r = el.getBoundingClientRect();
            el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            el.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    }
    document.querySelectorAll('.skills-card, .skills-browser').forEach(addSpotlight);

    /* ----- Tilt halus jendela browser (mouse saja) ----- */
    var browser = document.querySelector('.skills-browser');
    if (browser && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
        browser.addEventListener('mousemove', function (e) {
            var r = browser.getBoundingClientRect();
            if (!r.width || !r.height) return;
            var x = (e.clientX - r.left) / r.width - 0.5;
            var y = (e.clientY - r.top) / r.height - 0.5;
            browser.style.transform = 'perspective(1200px) rotateY(' + (x * 3).toFixed(2) +
                'deg) rotateX(' + (-y * 3).toFixed(2) + 'deg)';
        });
        browser.addEventListener('mouseleave', function () {
            browser.style.transform = '';
        });
    }
})();

/* ---------- Three.js Skills (2026-11-08, "kasih Three.js tapi jangan banyak") ----------
   SATU canvas kecil di belakang section: partikel + 2 wireframe yang berputar pelan.
   Dibuat HANYA saat section terlihat, DIHAPUS (canvas dilepas dari DOM) 3 detik
   setelah di-scroll lewat — jadi konteks WebGL tidak menumpuk (kasus refresh iPhone).
   Render hanya saat terlihat. Tanpa WebGL di Three.js? Tidak jalan, aman (guarded). */
(function () {
    'use strict';

    var section = document.querySelector('.skills-showcase');
    if (!section || typeof THREE === 'undefined') return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var renderer = null, scene = null, camera = null, group = null;
    var raf = null, visible = false, disposeTimer = null;

    function create() {
        var canvas = document.createElement('canvas');
        canvas.id = 'skills-three-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        section.insertBefore(canvas, section.firstChild);

        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
        camera.position.z = 7;
        group = new THREE.Group();

        var count = 45;
        var geo = new THREE.BufferGeometry();
        var pos = new Float32Array(count * 3);
        var col = new Float32Array(count * 3);
        var c1 = new THREE.Color(0x00d4ff);
        var c2 = new THREE.Color(0x8b5cf6);
        for (var i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 14;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 7;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
            var c = Math.random() > 0.5 ? c1 : c2;
            col[i * 3] = c.r;
            col[i * 3 + 1] = c.g;
            col[i * 3 + 2] = c.b;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        group.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.09, vertexColors: true, transparent: true, opacity: 0.75 })));

        var ico = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.9, 0),
            new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.5 })
        );
        ico.position.set(-4.5, 1.2, -1);
        group.add(ico);

        var torus = new THREE.Mesh(
            new THREE.TorusGeometry(0.7, 0.22, 10, 24),
            new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.5 })
        );
        torus.position.set(4.6, -1.1, -0.5);
        group.add(torus);

        scene.add(group);
        resize();
        window.addEventListener('resize', resize);

        if (reduceMotion) {
            renderer.render(scene, camera);
            return;
        }
        tick();
    }

    function resize() {
        if (!renderer || !camera) return;
        var w = section.clientWidth;
        var h = section.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }

    function tick() {
        raf = null;
        if (!visible || !renderer || !group) return;
        group.rotation.y += 0.0012;
        if (group.children[1]) group.children[1].rotation.x += 0.008;
        if (group.children[2]) group.children[2].rotation.y += 0.01;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
    }

    function dispose() {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
        if (renderer) {
            window.removeEventListener('resize', resize);
            if (scene) {
                scene.traverse(function (obj) {
                    if (obj.geometry) obj.geometry.dispose();
                    if (obj.material) obj.material.dispose();
                });
            }
            renderer.dispose();
            var canvas = renderer.domElement;
            if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
            renderer = null;
            scene = null;
            camera = null;
            group = null;
        }
    }

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    if (disposeTimer) {
                        clearTimeout(disposeTimer);
                        disposeTimer = null;
                    }
                    visible = true;
                    if (!renderer) create();
                    else if (!raf && !reduceMotion) tick();
                } else {
                    visible = false;
                    if (raf) {
                        cancelAnimationFrame(raf);
                        raf = null;
                    }
                    if (disposeTimer) clearTimeout(disposeTimer);
                    disposeTimer = setTimeout(function () {
                        if (!visible) dispose();
                    }, 3000);
                }
            });
        }, { threshold: 0 }).observe(section);
    } else {
        visible = true;
        create();
    }
})();
