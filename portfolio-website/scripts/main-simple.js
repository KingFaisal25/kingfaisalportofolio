// Simplified JavaScript for Portfolio Website
// Focus on core functionality without complex animations

document.addEventListener('DOMContentLoaded', () => {
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) navMenu.classList.remove('active');
    if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'false');

    // Language toggle & i18n
    const i18n = {
        en: {
            nav: { home: 'Home', about: 'About', services: 'Services', projects: 'Projects', skills: 'Skills', contact: 'Contact' },
            badge: '🚀 Available for new projects',
            heroTitle: '<span class="gradient-text">King Faisal</span> — <span class="title-accent">IT Engineer & Enterprise Solutions</span>',
            heroDescription: '🚀 Professional in <strong>IT Engineering</strong> and <strong>Enterprise Architecture</strong> focusing on <span class="highlight-tech">Cybersecurity</span>, <span class="highlight-tech">Database Architecture</span>, and <span class="highlight-tech">Cloud Infrastructure</span>. I design <strong>scalable</strong>, <strong>secure</strong>, and <strong>high‑performance</strong> solutions to accelerate your digital transformation.<br><br>I also deliver modern <strong>Web Development</strong> and <strong>Mobile Apps (Android/iOS)</strong> — responsive, fast, and results‑oriented to grow your brand and business.',
            ctaPrimary: '<i class="fas fa-globe"></i> 🌐 Order Website & App',
            ctaSecondary: '<i class="fas fa-comments"></i> 💬 Free Consultation',
            footer: { nav: 'Navigation', services: 'Services', contact: 'Contact' },
            newsletter: { text: 'Get tech insights and security tips straight to your inbox.', button: '<i class="fas fa-envelope"></i> Subscribe' },
            contact: {
                labels: { name: 'Full Name', email: 'Email Address', subject: 'Project Title', service: 'Service Type', message: 'Your Message' },
                submit: { idle: '<span class="btn-text">Send Message</span><i class="fas fa-paper-plane"></i>', sending: '<i class="fas fa-spinner fa-spin"></i> Sending...', sent: '<i class="fas fa-check"></i> Message Sent!' },
                invalid: 'Please complete all required fields.'
            },
            misc: { backToTop: 'Back to top', breadcrumbHome: 'Home' },
            dict: {
                'contact.cta.form': '<i class="fas fa-edit"></i> Fill Project Form',
                'hero.status': '🟢 Available for Projects',
                'services.badge': 'Services',
                'services.title': 'End‑to‑End Digital Solutions',
                'services.desc': 'Integrated services for <span class="gradient-text">modern websites</span>, <span class="gradient-text">mobile applications</span>, and <span class="gradient-text">security & operations</span> with high performance and measurable outcomes.',
                'services.web.title': 'Website Development',
                'services.web.text': 'Company profile, landing pages, e‑commerce, and admin dashboards with modern design, SEO‑ready, fast access, and optimized conversion.',
                'services.web.cta': '<i class="fas fa-rocket"></i> Order Now',
                'services.app.title': 'Mobile App Development (APK)',
                'services.app.text': 'Android/iOS apps with React Native or Flutter — stable, secure, easy to evolve, and ready to scale for your business.',
                'services.app.cta': '<i class="fas fa-rocket"></i> Order Now',
                'services.sec.title': 'Maintenance & Security',
                'services.sec.text': 'Scheduled maintenance, performance optimization, security audits, and proactive monitoring to keep systems reliable, secure, and efficient.',
                'services.sec.cta': '<i class="fas fa-rocket"></i> Request a Quote',
                'services.footer.cta': '<i class="fas fa-comments"></i> Discuss Your Needs',
                'about.badge': 'About Me',
                'about.title': 'IT Engineer | Cybersecurity Specialist | Full Stack Developer',
                'about.desc': 'Transforming complex systems into solutions that are <span class="gradient-text">secure</span>, <span class="gradient-text">scalable</span>, and <span class="gradient-text">high‑performance</span>.',
                'about.heading': 'Designing <span class="gradient-text">Digital Solutions</span> for <span class="gradient-text">Enterprise</span>',
                'about.text': 'I help businesses and institutions build a strong technology foundation through <strong>security architecture</strong>, <strong>enterprise database management</strong>, and <strong>full‑stack development</strong>. My focus is on delivering secure, scalable, and results‑oriented solutions.<br><br>Expertise includes: Security Risk Assessment, Database Optimization, Cloud Infrastructure, and DevOps Implementation. The combination of cybersecurity and optimal performance is the key to sustainable digital transformation.<br><br><strong>Vision</strong>: Becoming a trusted technology partner that drives efficiency and innovation through modern, scalable IT solutions.<br><br>I also deliver <strong>Websites</strong> and <strong>Apps (Android/iOS)</strong> with modern design, high performance, and top‑tier security for business and personal needs.',
                'about.actions.services': '<i class="fas fa-toolbox"></i> View Services',
                'about.actions.quote': '<i class="fas fa-paper-plane"></i> Request a Quote',
                'about.info.location.label': 'Location',
                'about.info.email.label': 'Email',
                'skills.badge': 'Technical Mastery',
                'skills.title': 'IT Engineering Excellence',
                'skills.desc': 'Mastering <span class="gradient-text">enterprise infrastructure</span>, <span class="gradient-text">cybersecurity</span>, and <span class="gradient-text">modern development stack</span> for world‑class IT solutions.',
                'projects.badge': 'Portfolio',
                'projects.title': 'Featured Projects',
                'projects.desc': 'Showcasing <span class="gradient-text">innovative solutions</span> and <span class="gradient-text">technical excellence</span> in real‑world implementations.',
                'contact.badge': 'Contact Me',
                'contact.title': 'Let’s Work Together',
                'contact.desc': 'Ready to turn your ideas into impactful <span class="gradient-text">digital solutions</span>? Let’s get started.' ,
                'footer.availability': 'Available for new projects'
            }
        },
        id: {
            nav: { home: 'Beranda', about: 'Tentang', services: 'Layanan', projects: 'Projek', skills: 'Keahlian', contact: 'Kontak' },
            badge: '🚀 Tersedia untuk proyek baru',
            heroTitle: '<span class="gradient-text">King Faisal</span> — <span class="title-accent">IT Engineer & Enterprise Solutions</span>',
            heroDescription: '🚀 Profesional di bidang <strong>IT Engineering</strong> dan <strong>Enterprise Architecture</strong> yang fokus pada <span class="highlight-tech">Keamanan Siber</span>, <span class="highlight-tech">Arsitektur Database</span>, dan <span class="highlight-tech">Infrastruktur Cloud</span>. Saya merancang solusi yang <strong>scalable</strong>, <strong>aman</strong>, dan <strong>berkinerja tinggi</strong> untuk mempercepat transformasi digital Anda.<br><br>Saya juga menerima <strong>Pembuatan Website</strong> dan <strong>Aplikasi (Android/iOS)</strong> modern yang responsif, cepat, dan berorientasi hasil — siap membantu brand dan bisnis Anda tumbuh.',
            ctaPrimary: '<i class="fas fa-globe"></i> 🌐 Pesan Jasa Website & Aplikasi',
            ctaSecondary: '<i class="fas fa-comments"></i> 💬 Konsultasi Gratis',
            footer: { nav: 'Navigasi', services: 'Layanan', contact: 'Kontak' },
            newsletter: { text: 'Dapatkan insight teknologi dan tips keamanan langsung ke email Anda.', button: '<i class="fas fa-envelope"></i> Berlangganan' },
            contact: {
                labels: { name: 'Nama Lengkap', email: 'Alamat Email', subject: 'Judul Proyek', service: 'Jenis Layanan', message: 'Pesan Anda' },
                submit: { idle: '<span class="btn-text">Kirim Pesan</span><i class="fas fa-paper-plane"></i>', sending: '<i class="fas fa-spinner fa-spin"></i> Mengirim...', sent: '<i class="fas fa-check"></i> Pesan Terkirim!' },
                invalid: 'Mohon lengkapi semua field yang wajib.'
            },
            misc: { backToTop: 'Kembali ke atas', breadcrumbHome: 'Beranda' },
            dict: {
                'contact.cta.form': '<i class="fas fa-edit"></i> Isi Form Proyek',
                'hero.status': '🟢 Tersedia untuk Proyek',
                'services.badge': 'Layanan',
                'services.title': 'Solusi Digital End‑to‑End',
                'services.desc': 'Layanan terintegrasi untuk <span class="gradient-text">website modern</span>, <span class="gradient-text">aplikasi mobile</span>, dan <span class="gradient-text">keamanan & operasi</span> dengan performa tinggi serta hasil yang terukur.',
                'services.web.title': 'Pembuatan Website',
                'services.web.text': 'Company profile, landing page, e‑commerce, dan dashboard admin dengan desain modern, SEO‑ready, akses cepat, dan konversi optimal.',
                'services.web.cta': '<i class="fas fa-rocket"></i> Pesan Sekarang',
                'services.app.title': 'Pembuatan Aplikasi (APK)',
                'services.app.text': 'Aplikasi Android/iOS berbasis React Native atau Flutter — stabil, aman, mudah dikembangkan, dan siap scale sesuai kebutuhan bisnis.',
                'services.app.cta': '<i class="fas fa-rocket"></i> Pesan Sekarang',
                'services.sec.title': 'Maintenance & Keamanan',
                'services.sec.text': 'Maintenance berkala, optimasi performa, audit keamanan, dan monitoring proaktif agar sistem selalu reliable, aman, dan efisien.',
                'services.sec.cta': '<i class="fas fa-rocket"></i> Minta Penawaran',
                'services.footer.cta': '<i class="fas fa-comments"></i> Diskusikan Kebutuhan Anda',
                'about.badge': 'Tentang Saya',
                'about.title': 'IT Engineer | Cybersecurity Specialist | Full Stack Developer',
                'about.desc': 'Mengubah sistem kompleks menjadi solusi yang <span class="gradient-text">aman</span>, <span class="gradient-text">scalable</span>, dan <span class="gradient-text">berkinerja tinggi</span>.',
                'about.heading': 'Merancang <span class="gradient-text">Solusi Digital</span> Kelas <span class="gradient-text">Enterprise</span>',
                'about.text': 'Saya membantu bisnis dan institusi membangun fondasi teknologi yang kuat melalui <strong>arsitektur keamanan</strong>, <strong>manajemen database enterprise</strong>, dan <strong>pengembangan full‑stack</strong>. Fokus saya adalah menghadirkan solusi yang aman, skalabel, dan berorientasi hasil.<br><br>Keahlian meliputi: Security Risk Assessment, Database Optimization, Cloud Infrastructure, dan DevOps Implementation. Kombinasi keamanan siber dan performa optimal adalah kunci transformasi digital yang berkelanjutan.<br><br><strong>Visi</strong>: Menjadi mitra teknologi tepercaya yang mendorong efisiensi dan inovasi melalui solusi IT modern yang terukur.<br><br>Saya juga menerima <strong>Website</strong> dan <strong>Aplikasi (Android/iOS)</strong> dengan desain modern, performa tinggi, dan keamanan terbaik untuk kebutuhan bisnis maupun personal.',
                'about.actions.services': '<i class="fas fa-toolbox"></i> Lihat Layanan',
                'about.actions.quote': '<i class="fas fa-paper-plane"></i> Minta Penawaran',
                'about.info.location.label': 'Lokasi',
                'about.info.email.label': 'Email',
                'skills.badge': 'Kemampuan Teknis',
                'skills.title': 'Keunggulan IT Engineering',
                'skills.desc': 'Menguasai <span class="gradient-text">infrastruktur enterprise</span>, <span class="gradient-text">keamanan siber</span>, dan <span class="gradient-text">modern development stack</span> untuk solusi IT kelas dunia.',
                'projects.badge': 'Portofolio',
                'projects.title': 'Projek Pilihan',
                'projects.desc': 'Menampilkan <span class="gradient-text">solusi inovatif</span> dan <span class="gradient-text">keunggulan teknis</span> dalam implementasi nyata.',
                'contact.badge': 'Hubungi Saya',
                'contact.title': 'Mari Bekerja Sama',
                'contact.desc': 'Siap mengubah ide Anda menjadi <span class="gradient-text">solusi digital</span> yang berdampak? Ayo mulai.',
                'footer.availability': 'Tersedia untuk proyek baru'
            }
        }
    };

    function applyLanguage(lang) {
        const t = i18n[lang] || i18n.id;
        document.documentElement.lang = lang;
        const toggleBtn = document.getElementById('langToggle');
        if (toggleBtn) toggleBtn.textContent = lang.toUpperCase();
        const navMap = [
            { sel: '[data-section="home"] span:last-child', text: t.nav.home },
            { sel: '[data-section="about"] span:last-child', text: t.nav.about },
            { sel: '[data-section="services"] span:last-child', text: t.nav.services },
            { sel: '[data-section="projects"] span:last-child', text: t.nav.projects },
            { sel: '[data-section="skills"] span:last-child', text: t.nav.skills },
            { sel: '[data-section="contact"] span:last-child', text: t.nav.contact },
        ];
        navMap.forEach(({ sel, text }) => { const el = document.querySelector(sel); if (el) el.textContent = text; });
        const badgeTextEl = document.querySelector('.hero-badge span:last-child');
        if (badgeTextEl) badgeTextEl.textContent = t.badge;
        const heroTitle = document.getElementById('heroTitle'); if (heroTitle) heroTitle.innerHTML = t.heroTitle;
        const heroDesc = document.getElementById('heroDescription'); if (heroDesc) heroDesc.innerHTML = t.heroDescription;
        const ctaPrimary = document.querySelector('.hero-actions .btn-primary'); if (ctaPrimary) ctaPrimary.innerHTML = t.ctaPrimary;
        const ctaSecondary = document.querySelector('.hero-actions .btn-secondary'); if (ctaSecondary) ctaSecondary.innerHTML = t.ctaSecondary;
        const footerNav = document.querySelector('.footer-column h4:nth-of-type(1)');
        const footerCols = document.querySelectorAll('.footer-column h4');
        if (footerCols.length >= 3) {
            footerCols[0].textContent = t.footer.nav;
            footerCols[1].textContent = t.footer.services;
            footerCols[2].textContent = t.footer.contact;
        }
        const newsText = document.querySelector('.newsletter-text'); if (newsText) newsText.textContent = t.newsletter.text;
        const newsBtn = document.querySelector('.newsletter-submit'); if (newsBtn) newsBtn.innerHTML = t.newsletter.button;
        const backTop = document.querySelector('.back-to-top'); if (backTop) backTop.setAttribute('aria-label', t.misc.backToTop);
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t.dict && t.dict[key]) el.innerHTML = t.dict[key];
        });
        // Contact form labels
        const labelMap = [
            { forSel: 'label[for="name"]', text: t.contact.labels.name },
            { forSel: 'label[for="email"]', text: t.contact.labels.email },
            { forSel: 'label[for="subject"]', text: t.contact.labels.subject },
            { forSel: 'label[for="service"]', text: t.contact.labels.service },
            { forSel: 'label[for="message"]', text: t.contact.labels.message },
        ];
        labelMap.forEach(({ forSel, text }) => { const el = document.querySelector(forSel); if (el) el.textContent = text; });
        const submitBtn = document.querySelector('.submit-btn-modern');
        if (submitBtn) submitBtn.innerHTML = t.contact.submit.idle;
        localStorage.setItem('lang', lang);
    }

    const savedLang = localStorage.getItem('lang') || (navigator.language || 'id').startsWith('en') ? 'en' : 'id';
    applyLanguage(savedLang);
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const current = localStorage.getItem('lang') || 'id';
            const next = current === 'id' ? 'en' : 'id';
            applyLanguage(next);
        });
    }

    // Background music autoplay (best-effort, respects browser policies)
    (function(){
        const audio = document.getElementById('bgAudio');
        if (!audio) return;
        const targetVol = 0.4;
        let fading = null;
        const fadeTo = (to) => {
            if (fading) cancelAnimationFrame(fading);
            const step = () => {
                const diff = to - audio.volume;
                if (Math.abs(diff) < 0.02) { audio.volume = to; return; }
                audio.volume += diff * 0.12;
                fading = requestAnimationFrame(step);
            };
            fading = requestAnimationFrame(step);
        };
        const tryPlay = async () => {
            try {
                audio.muted = false;
                audio.volume = 0.0;
                await audio.play();
                fadeTo(targetVol);
            } catch(e) {
                // Fallback: play muted, then unmute on first user interaction
                try {
                    audio.muted = true;
                    audio.volume = 0.0;
                    await audio.play();
                    const unlock = () => {
                        audio.muted = false;
                        fadeTo(targetVol);
                        window.removeEventListener('pointerdown', unlock);
                        window.removeEventListener('keydown', unlock);
                        window.removeEventListener('touchstart', unlock);
                        window.removeEventListener('scroll', unlock, { passive: true });
                    };
                    window.addEventListener('pointerdown', unlock, { once: true });
                    window.addEventListener('keydown', unlock, { once: true });
                    window.addEventListener('touchstart', unlock, { once: true });
                    window.addEventListener('scroll', unlock, { once: true, passive: true });
                } catch(_) {
                    // If even muted autoplay fails, do nothing
                }
            }
        };
        tryPlay();
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && !audio.paused) fadeTo(0.15); else if (!document.hidden && !audio.paused) fadeTo(targetVol);
        });
    })();
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            const expanded = mobileMenuToggle.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });
        document.addEventListener('click', (e) => {
            const t = e.target;
            const withinToggle = mobileMenuToggle.contains(t);
            const withinMenu = navMenu.contains(t);
            if (navMenu.classList.contains('active') && !withinToggle && !withinMenu) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
            }
        }, { passive: true });
        window.addEventListener('resize', () => {
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            if (!isMobile) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    // Smooth scroll inertia via requestAnimationFrame
    function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function smoothScrollTo(targetY, duration = 500) {
        const startY = window.scrollY;
        const diff = targetY - startY;
        let start;
        function step(timestamp) {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeInOutCubic(progress);
            window.scrollTo(0, startY + diff * eased);
            if (elapsed < duration) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const rect = target.getBoundingClientRect();
            const targetY = rect.top + window.scrollY - 60;
            smoothScrollTo(targetY, 600);
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
    
    // Scroll progress bar
    let scheduled = false;
    function onScrollRaf() {
        scheduled = false;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolledPercent = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolledPercent + '%';
            progressBar.setAttribute('aria-valuenow', String(Math.round(scrolledPercent)));
        }
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 20) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        }
        // subtle parallax for hero (disabled if reduced motion)
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduceMotion) {
            const heroImg = document.querySelector('.hero-image-container-modern');
            const heroTitleEl = document.getElementById('heroTitle');
            const maxScroll = 500;
            const s = Math.min(window.scrollY, maxScroll);
            const factorImg = window.matchMedia('(max-width: 767px)').matches ? 0.02 : 0.04;
            const factorTitle = window.matchMedia('(max-width: 767px)').matches ? 0.008 : 0.015;
            if (heroImg) {
                const ty = -(s * factorImg);
                const scale = 1 + (s / (factorImg === 0.02 ? 18000 : 12000));
                heroImg.style.transform = `translateY(${ty}px) scale(${scale.toFixed(3)})`;
            }
            if (heroTitleEl) {
                const ty2 = -(s * factorTitle);
                heroTitleEl.style.transform = `translateY(${ty2}px)`;
            }
        }
        const sections = ['home', 'about', 'skills', 'projects', 'contact'];
        const navLinks = document.querySelectorAll('.nav-link');
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    navLinks.forEach(link => { link.classList.remove('active'); link.setAttribute('aria-current', 'false'); });
                    const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
                    if (activeLink) { activeLink.classList.add('active'); activeLink.setAttribute('aria-current', 'page'); }
                }
            }
        });
    }
    window.addEventListener('scroll', () => {
        if (!scheduled) { scheduled = true; requestAnimationFrame(onScrollRaf); }
    }, { passive: true });

    
    
    // Simple typing effect
    const typingText = document.getElementById('typingText');
    if (typingText) {
        const words = ['Senior IT Engineer', 'Database Administrator', 'Cybersecurity Engineer', 'Cloud & DevOps', 'Full Stack Developer'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeEffect() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentWord.length) {
                setTimeout(() => isDeleting = true, 3000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
            
            setTimeout(typeEffect, isDeleting ? 80 : 150);
        }
        
        typeEffect();
    }
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const statusMessage = contactForm.querySelector('.status-message');
        contactForm.querySelectorAll('.form-field input, .form-field select, .form-field textarea').forEach(el => {
            el.addEventListener('focus', () => el.closest('.form-field')?.classList.remove('invalid'));
        });
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn-modern');
            if (!submitBtn) return;
            
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            const lang = localStorage.getItem('lang') || 'id';
            const t = i18n[lang];
            submitBtn.innerHTML = t.contact.submit.sending;
            submitBtn.disabled = true;
            let valid = true;
            ['name','email','subject','service','message'].forEach(id => {
                const el = contactForm.querySelector(`#${id}`);
                if (el && !el.value) { el.closest('.form-field')?.classList.add('invalid'); valid = false; }
            });
            if (!valid) {
                if (statusMessage) { statusMessage.textContent = t.contact.invalid; }
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = t.contact.submit.sent;
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                // Reset form
                contactForm.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            }, 2000);
        });
    }
    
    // Hide loading overlay when page loads
    window.addEventListener('load', () => {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500);
        }
        
        const pageLoader = document.getElementById('page-loader');
        if (pageLoader) {
            pageLoader.style.display = 'none';
        }

        if (window.AOS && typeof window.AOS.init === 'function') {
            window.AOS.init({
                duration: 500,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                offset: 140,
                once: true,
                anchorPlacement: 'top-bottom'
            });
            document.querySelectorAll('.section-header, .service-card, .project-card, .expertise-item, .highlight-item, .personal-card').forEach(el => {
                if (!el.hasAttribute('data-aos')) el.setAttribute('data-aos', 'fade-up');
                if (!el.hasAttribute('data-aos-delay')) el.setAttribute('data-aos-delay', '100');
            });
        }
        if (window.gsap) {
            if (window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);
            const heroEls = [document.querySelector('.hero-badge'), document.querySelector('.hero-title'), document.querySelector('.hero-description'), document.querySelector('.hero-actions')].filter(Boolean);
            if (heroEls.length) window.gsap.from(heroEls, { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' });
            document.querySelectorAll('.section-header').forEach(h => {
                const items = Array.from(h.children);
                window.gsap.from(items, { y: 16, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: h, start: 'top 85%', once: true } });
            });
            
            const skillsSection = document.getElementById('skills');
            if (skillsSection) {
                
                const statItems = skillsSection.querySelectorAll('.skills-stats .skill-stat-item');
                if (statItems.length) tl.from(statItems, { y: 12, opacity: 0, duration: 0.4, ease: 'power2.out', stagger: 0.06 }, '>-0.1');
                const certItems = skillsSection.querySelectorAll('.skills-certifications .cert-item');
                if (certItems.length) tl.from(certItems, { y: 12, opacity: 0, duration: 0.4, ease: 'power2.out', stagger: 0.06 }, '-=0.2');
            }
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const cItems = contactSection.querySelectorAll('.contact-item, .contact-stat, .contact-form-modern, .social-link');
                if (cItems.length) window.gsap.from(cItems, { y: 14, opacity: 0, duration: 0.4, ease: 'power2.out', stagger: 0.05, scrollTrigger: { trigger: contactSection, start: 'top 85%', once: true } });
            }
            document.querySelectorAll('.stat-number').forEach(num => {
                const target = parseInt(num.getAttribute('data-count') || '0', 10);
                const obj = { val: 0 };
                window.gsap.to(obj, { val: target, duration: 1.2, ease: 'power2.out', onUpdate: () => { num.textContent = Math.round(obj.val).toString(); }, scrollTrigger: { trigger: num, start: 'top 90%', once: true } });
            });
            const aboutItems = document.querySelectorAll('.highlight-item, .expertise-item, .personal-card');
            if (aboutItems.length) window.gsap.from(aboutItems, { y: 18, opacity: 0, duration: 0.6, ease: 'power2.out', stagger: 0.06, scrollTrigger: { trigger: document.querySelector('#about'), start: 'top 80%', once: true } });

            
        } else {
            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const num = entry.target;
                        const target = parseInt(num.getAttribute('data-count') || '0', 10);
                        let start = 0;
                        const duration = 1000;
                        const t0 = performance.now();
                        function step(ts) {
                            const progress = Math.min((ts - t0) / duration, 1);
                            const eased = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                            num.textContent = String(Math.round(start + (target - start) * eased));
                            if (progress < 1) requestAnimationFrame(step);
                        }
                        requestAnimationFrame(step);
                        io.unobserve(num);
                    }
                });
            }, { threshold: 0.4 });
            document.querySelectorAll('.stat-number').forEach(el => io.observe(el));

            const revealTargets = [
                ...Array.from(document.querySelectorAll('.section-header > *')),
                ...Array.from(document.querySelectorAll('.highlight-item, .expertise-item, .personal-card'))
            ];
            const ioReveal = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-visible');
                        ioReveal.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            revealTargets.forEach(el => { el.classList.add('reveal-item'); ioReveal.observe(el); });
        }

    // Interactive tilt on cards (desktop only)
    (function(){
        const supportsHover = window.matchMedia('(hover: hover)').matches;
        if (!supportsHover) return;
        const cards = document.querySelectorAll('.service-card, .project-card');
        cards.forEach(card => {
            const handler = (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; const y = e.clientY - rect.top;
                const rx = ((y / rect.height) - 0.5) * -6;
                const ry = ((x / rect.width) - 0.5) * 6;
                card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
            };
            const reset = () => { card.style.transform = ''; };
            card.addEventListener('mousemove', handler);
            card.addEventListener('mouseleave', reset);
            card.addEventListener('blur', reset);
        });
        const hero = document.querySelector('.hero-image-container-modern');
        if (hero) {
            const onMove = (e) => {
                const rect = hero.getBoundingClientRect();
                const x = e.clientX - rect.left; const y = e.clientY - rect.top;
                const rx = ((y / rect.height) - 0.5) * -4;
                const ry = ((x / rect.width) - 0.5) * 4;
                hero.style.transform += ` rotateX(${rx}deg) rotateY(${ry}deg)`;
            };
            const resetHero = () => { hero.style.transform = ''; };
            hero.addEventListener('mousemove', onMove);
            hero.addEventListener('mouseleave', resetHero);
        }
    })();

    // Back to top button
    (function(){
        let btn = document.querySelector('.back-to-top');
        if (!btn) {
            btn = document.createElement('button');
            btn.className = 'back-to-top';
            btn.setAttribute('aria-label', 'Kembali ke atas');
            btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            document.body.appendChild(btn);
        }
        const toggle = () => {
            if (window.scrollY > 300) btn.classList.add('show'); else btn.classList.remove('show');
        };
        window.addEventListener('scroll', toggle, { passive: true });
        toggle();
        btn.addEventListener('click', () => smoothScrollTo(0, 600));
    })();

    (function(){
        let wa = document.querySelector('.cta-whatsapp');
        if (!wa) {
            wa = document.createElement('a');
            wa.className = 'cta-whatsapp';
            wa.href = 'https://wa.me/6285798137527?text=Halo%20King%20Faisal,%20saya%20ingin%20diskusi%20proyek%20IT.';
            wa.target = '_blank';
            wa.rel = 'noopener noreferrer';
            wa.setAttribute('aria-label', 'WhatsApp CTA');
            wa.innerHTML = '<i class="fab fa-whatsapp social-icon"></i>';
            document.body.appendChild(wa);
        }
        const toggle = () => { if (window.scrollY > 300) wa.classList.add('show'); else wa.classList.remove('show'); };
        window.addEventListener('scroll', toggle, { passive: true });
        toggle();
    })();

    (function(){
        const form = document.getElementById('contactForm');
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = (form.querySelector('#name') || {}).value || '';
            const email = (form.querySelector('#email') || {}).value || '';
            const subject = (form.querySelector('#subject') || {}).value || '';
            const service = (form.querySelector('#service') || {}).value || '';
            const message = (form.querySelector('#message') || {}).value || '';
            const phone = '6285798137527';
            const lang = localStorage.getItem('lang') || 'id';
            const text = lang === 'en'
                ? `Hello King Faisal,\n\nName: ${name}\nEmail: ${email}\nTitle: ${subject}\nService: ${service}\nMessage: ${message}`
                : `Halo King Faisal,\n\nNama: ${name}\nEmail: ${email}\nJudul: ${subject}\nLayanan: ${service}\nPesan: ${message}`;
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        });
    })();

    (function(){
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduceMotion) {
            const cards = Array.from(document.querySelectorAll('.project-card'));
            const update = () => {
                cards.forEach(card => {
                    const img = card.querySelector('.project-image');
                    if (!img) return;
                    const rect = card.getBoundingClientRect();
                    const vh = window.innerHeight;
                    if (rect.top > vh || rect.bottom < 0) return;
                    const mid = rect.top + rect.height / 2;
                    const dist = (mid - vh / 2) / vh;
                    const ty = dist * -20;
                    const sc = 1 + Math.max(-0.01, Math.min(0.02, -dist * 0.04));
                    img.style.transform = `translateY(${ty.toFixed(1)}px) scale(${sc.toFixed(3)})`;
                });
            };
            window.addEventListener('scroll', update, { passive: true });
            update();
        }
    })();

    (function(){
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .submit-btn-modern');
        buttons.forEach(btn => {
            btn.addEventListener('click', function(e){
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const r = document.createElement('span');
                r.className = 'ripple';
                r.style.left = x + 'px';
                r.style.top = y + 'px';
                const maxDim = Math.max(rect.width, rect.height);
                r.style.width = r.style.height = maxDim + 'px';
                this.appendChild(r);
                setTimeout(() => { r.remove(); }, 600);
            }, { passive: true });
        });
    })();

    (function(){
        const mapTitleToDemo = {
            'MyPesantren': 'https://pesantrensalafyalaulia.github.io/PondokPesantrenSalafyAlAulia/',
            'SDLKnives': 'https://sdlknives.github.io/sdlknives-web/'
        };
        document.querySelectorAll('.project-card').forEach(card => {
            const titleEl = card.querySelector('h3');
            const demoLink = card.querySelector('.project-links a.project-link');
            const url = demoLink && demoLink.href ? demoLink.href : (titleEl ? mapTitleToDemo[titleEl.textContent.trim()] : null);
            if (!url) return;
            const openDemo = () => window.open(url, '_blank', 'noopener');
            card.addEventListener('click', openDemo);
            card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDemo(); } });
        });
    })();
    });
    
    
});
