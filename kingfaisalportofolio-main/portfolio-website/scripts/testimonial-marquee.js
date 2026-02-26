/**
 * Testimonial Marquee Controller
 * Handles smooth horizontal scrolling animation for testimonials
 * Features: pause on hover, responsive speed control, performance optimization
 */

class TestimonialMarquee {
    constructor() {
        this.track = null;
        this.container = null;
        this.isPaused = false;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.speedMultiplier = 1;
        this.baseSpeed = 30; // seconds for one full cycle
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupResponsiveSpeed();
        this.optimizePerformance();
        
        // Start animation if not reduced motion
        if (!this.isReducedMotion) {
            this.startAnimation();
        }
    }

    setupElements() {
        this.container = document.querySelector('.testimonial-marquee-container');
        this.track = document.querySelector('.testimonial-marquee-track');
        
        if (!this.track || !this.container) {
            console.warn('Testimonial marquee elements not found');
            return;
        }

        // Clone testimonials for seamless loop
        this.cloneTestimonials();
    }

    cloneTestimonials() {
        if (!this.track) return;
        
        const testimonials = Array.from(this.track.children);
        const trackWidth = this.track.scrollWidth;
        const containerWidth = this.container.offsetWidth;
        
        // Calculate how many clones we need to fill at least 2x container width
        const neededClones = Math.ceil((containerWidth * 2) / trackWidth) + 1;
        
        // Clone testimonials
        for (let i = 0; i < neededClones; i++) {
            testimonials.forEach(testimonial => {
                const clone = testimonial.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                this.track.appendChild(clone);
            });
        }
    }

    setupEventListeners() {
        if (!this.container || !this.track) return;

        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.pause());
        this.container.addEventListener('mouseleave', () => this.resume());
        
        // Pause on focus (accessibility)
        this.track.addEventListener('focusin', () => this.pause());
        this.track.addEventListener('focusout', () => this.resume());
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });

        // Handle reduced motion preference change
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.isReducedMotion = e.matches;
            if (this.isReducedMotion) {
                this.stopAnimation();
            } else {
                this.startAnimation();
            }
        });

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.setupResponsiveSpeed();
                this.reinitializeClones();
            }, 250);
        });
    }

    setupResponsiveSpeed() {
        if (!this.track) return;
        
        const screenWidth = window.innerWidth;
        
        // Adjust speed based on screen size
        if (screenWidth <= 480) {
            this.speedMultiplier = 0.8; // Slower on mobile
        } else if (screenWidth <= 768) {
            this.speedMultiplier = 0.9; // Slightly slower on tablet
        } else {
            this.speedMultiplier = 1; // Normal speed on desktop
        }
        
        this.updateAnimationSpeed();
    }

    updateAnimationSpeed() {
        if (!this.track || this.isReducedMotion) return;
        
        const duration = this.baseSpeed / this.speedMultiplier;
        this.track.style.animationDuration = `${duration}s`;
    }

    startAnimation() {
        if (!this.track || this.isReducedMotion) return;
        
        this.track.style.animationPlayState = 'running';
        this.isPaused = false;
    }

    pause() {
        if (!this.track || this.isReducedMotion) return;
        
        this.track.style.animationPlayState = 'paused';
        this.isPaused = true;
    }

    resume() {
        if (!this.track || this.isReducedMotion || document.hidden) return;
        
        this.track.style.animationPlayState = 'running';
        this.isPaused = false;
    }

    stopAnimation() {
        if (!this.track) return;
        
        this.track.style.animation = 'none';
        this.isPaused = true;
    }

    reinitializeClones() {
        if (!this.track) return;
        
        // Remove existing clones
        const originalChildren = Array.from(this.track.children).filter(child => 
            child.getAttribute('aria-hidden') !== 'true'
        );
        
        // Clear track and re-add originals
        this.track.innerHTML = '';
        originalChildren.forEach(child => this.track.appendChild(child));
        
        // Re-clone for new dimensions
        this.cloneTestimonials();
        
        // Restart animation if needed
        if (!this.isReducedMotion) {
            this.startAnimation();
        }
    }

    optimizePerformance() {
        if (!this.track) return;
        
        // Enable hardware acceleration
        this.track.style.transform = 'translateZ(0)';
        this.track.style.willChange = 'transform';
        
        // Optimize for smooth scrolling
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startAnimation();
                } else {
                    this.pause();
                }
            });
        });
        
        if (this.container) {
            observer.observe(this.container);
        }
    }

    // Public API methods
    setSpeed(speed) {
        this.speedMultiplier = speed;
        this.updateAnimationSpeed();
    }

    pauseMarquee() {
        this.pause();
    }

    resumeMarquee() {
        this.resume();
    }

    destroy() {
        this.stopAnimation();
        
        // Remove event listeners
        if (this.container) {
            this.container.removeEventListener('mouseenter', this.pause);
            this.container.removeEventListener('mouseleave', this.resume);
        }
        
        if (this.track) {
            this.track.removeEventListener('focusin', this.pause);
            this.track.removeEventListener('focusout', this.resume);
        }
        
        document.removeEventListener('visibilitychange', this.pause);
        window.removeEventListener('resize', this.setupResponsiveSpeed);
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if marquee elements exist
    if (document.querySelector('.testimonial-marquee-container')) {
        window.testimonialMarquee = new TestimonialMarquee();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestimonialMarquee;
}