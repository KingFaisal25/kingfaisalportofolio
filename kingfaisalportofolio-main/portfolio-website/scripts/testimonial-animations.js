/**
 * Testimonial Animations - Viewport Trigger & Enhanced Interactions
 * Provides smooth viewport-triggered animations for testimonial cards
 * 
 * Features:
 * - Intersection Observer for viewport trigger
 * - Smooth 0.3-0.5s transitions
 * - Staggered animations
 * - Mobile-optimized performance
 * - Accessibility support
 * - Modern card design support
 */

(function() {
    'use strict';
    
    // Configuration
    const config = {
        threshold: 0.2, // 20% visibility threshold
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before entering viewport
        animationDuration: 400, // 0.4s duration
        staggerDelay: 150, // 0.15s between cards
        mobileThreshold: 0.1, // Lower threshold for mobile
        mobileDelay: 100, // Shorter delay for mobile
        starAnimationDelay: 200 // Delay for star rating animation
    };
    
    // State management
    let observer = null;
    let animatedElements = new Set();
    let isMobile = window.innerWidth <= 768;
    
    /**
     * Initialize testimonial animations
     */
    function init() {
        setupIntersectionObserver();
        observeTestimonialElements();
        setupResizeHandler();
        setupCardInteractions();
        setupAccessibility();
        setupStarAnimations();
    }
    
    /**
     * Setup Intersection Observer for viewport trigger
     */
    function setupIntersectionObserver() {
        const threshold = isMobile ? config.mobileThreshold : config.threshold;
        
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedElements.has(entry.target)) {
                    animateElement(entry.target);
                }
            });
        }, {
            threshold: threshold,
            rootMargin: config.rootMargin
        });
    }
    
    /**
     * Observe testimonial elements
     */
    function observeTestimonialElements() {
        const testimonialSection = document.querySelector('.testimonials-section');
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        const sectionTitle = document.querySelector('.testimonials-section h2, .testimonials-section .section-title');
        
        // Observe section title first
        if (sectionTitle) {
            observer.observe(sectionTitle);
        }
        
        // Observe each testimonial card
        testimonialCards.forEach((card, index) => {
            // Set card index for staggered animation
            card.style.setProperty('--card-index', index);
            
            // Add initial state
            if (!card.classList.contains('active')) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px) scale(0.95)';
            }
            
            observer.observe(card);
        });
        
        // Observe carousel controls if present
        const carouselControls = document.querySelector('.carousel-controls');
        if (carouselControls) {
            observer.observe(carouselControls);
        }
    }
    
    /**
     * Animate element when it enters viewport
     */
    function animateElement(element) {
        const isCard = element.classList.contains('testimonial-card');
        const isTitle = element.matches('h2, .section-title');
        const isControls = element.classList.contains('carousel-controls');
        
        // Mark as animated
        animatedElements.add(element);
        
        if (isCard) {
            animateTestimonialCard(element);
        } else if (isTitle) {
            animateSectionTitle(element);
        } else if (isControls) {
            animateControls(element);
        }
    }
    
    /**
     * Animate testimonial card with modern design support
     */
    function animateTestimonialCard(card) {
        const delay = isMobile ? config.mobileDelay : config.staggerDelay;
        const cardIndex = parseInt(card.style.getPropertyValue('--card-index')) || 0;
        const animationDelay = cardIndex * delay;
        
        // Add animate-in class
        setTimeout(() => {
            card.classList.add('animate-in');
            
            // Trigger star animation after card animation
            setTimeout(() => {
                animateStarRating(card);
            }, config.starAnimationDelay);
            
            // Remove initial styles
            setTimeout(() => {
                card.style.opacity = '';
                card.style.transform = '';
            }, config.animationDuration);
            
        }, animationDelay);
    }
    
    /**
     * Animate star rating with twinkle effect
     */
    function animateStarRating(card) {
        const starsContainer = card.querySelector('.stars');
        if (!starsContainer) return;
        
        const stars = starsContainer.querySelectorAll('i');
        const rating = parseFloat(starsContainer.dataset.rating) || 0;
        
        stars.forEach((star, index) => {
            setTimeout(() => {
                star.style.transform = 'scale(1.2)';
                star.style.filter = 'drop-shadow(0 0 8px #ffd700)';
                
                setTimeout(() => {
                    star.style.transform = 'scale(1)';
                    star.style.filter = '';
                }, 200);
            }, index * 100);
        });
    }
    
    /**
     * Animate section title
     */
    function animateSectionTitle(title) {
        title.style.opacity = '0';
        title.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            title.style.transition = `all ${config.animationDuration}ms cubic-bezier(0.23, 1, 0.32, 1)`;
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 100);
    }
    
    /**
     * Animate controls
     */
    function animateControls(controls) {
        controls.style.opacity = '0';
        controls.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            controls.style.transition = `all ${config.animationDuration}ms cubic-bezier(0.23, 1, 0.32, 1)`;
            controls.style.opacity = '1';
            controls.style.transform = 'translateY(0)';
        }, 200);
    }
    
    /**
     * Setup card interactions
     */
    function setupCardInteractions() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        testimonialCards.forEach(card => {
            // Enhanced hover effects for modern cards
            card.addEventListener('mouseenter', function() {
                if (!this.classList.contains('animate-in')) return;
                
                // Add glow effect
                this.style.boxShadow = '0 30px 60px rgba(79, 172, 254, 0.2), 0 0 0 2px rgba(79, 172, 254, 0.3)';
                
                // Animate user avatar
                const avatar = this.querySelector('.user-avatar img');
                if (avatar) {
                    avatar.style.transform = 'scale(1.1) rotate(2deg)';
                }
                
                // Animate tags
                const tags = this.querySelectorAll('.tag');
                tags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.style.transform = 'translateY(-2px)';
                        tag.style.boxShadow = '0 4px 12px rgba(79, 172, 254, 0.3)';
                    }, index * 50);
                });
                
                // Animate verified badge
                const verifiedBadge = this.querySelector('.verified-badge');
                if (verifiedBadge) {
                    verifiedBadge.style.transform = 'scale(1.05)';
                    verifiedBadge.style.background = 'rgba(34, 197, 94, 0.2)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                // Remove glow effect
                this.style.boxShadow = '';
                
                // Reset avatar
                const avatar = this.querySelector('.user-avatar img');
                if (avatar) {
                    avatar.style.transform = '';
                }
                
                // Reset tags
                const tags = this.querySelectorAll('.tag');
                tags.forEach(tag => {
                    tag.style.transform = '';
                    tag.style.boxShadow = '';
                });
                
                // Reset verified badge
                const verifiedBadge = this.querySelector('.verified-badge');
                if (verifiedBadge) {
                    verifiedBadge.style.transform = '';
                    verifiedBadge.style.background = '';
                }
            });
            
            // Click interaction for mobile
            card.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    this.classList.toggle('expanded');
                    
                    // Toggle expanded content
                    const expandedContent = this.querySelector('.expanded-content');
                    if (expandedContent) {
                        expandedContent.style.display = this.classList.contains('expanded') ? 'block' : 'none';
                    }
                }
            });
        });
    }
    
    /**
     * Setup star animations
     */
    function setupStarAnimations() {
        const starContainers = document.querySelectorAll('.stars');
        
        starContainers.forEach(container => {
            const stars = container.querySelectorAll('i');
            const rating = parseFloat(container.dataset.rating) || 0;
            
            stars.forEach((star, index) => {
                star.addEventListener('mouseenter', function() {
                    // Highlight up to current star
                    for (let i = 0; i <= index; i++) {
                        if (stars[i]) {
                            stars[i].style.transform = 'scale(1.2)';
                            stars[i].style.filter = 'drop-shadow(0 0 8px #ffd700)';
                        }
                    }
                });
                
                star.addEventListener('mouseleave', function() {
                    // Reset to original rating
                    stars.forEach((s, i) => {
                        if (i < Math.floor(rating)) {
                            s.style.transform = 'scale(1)';
                            s.style.filter = '';
                        } else if (i === Math.floor(rating) && rating % 1 !== 0) {
                            s.style.transform = 'scale(1)';
                            s.style.filter = '';
                        } else {
                            s.style.transform = 'scale(1)';
                            s.style.filter = '';
                        }
                    });
                });
            });
        });
    }
    
    /**
     * Setup resize handler
     */
    function setupResizeHandler() {
        let resizeTimer;
        
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                const newIsMobile = window.innerWidth <= 768;
                if (newIsMobile !== isMobile) {
                    isMobile = newIsMobile;
                    // Recreate observer with new threshold
                    if (observer) {
                        observer.disconnect();
                    }
                    setupIntersectionObserver();
                    // Re-observe elements
                    observeTestimonialElements();
                }
            }, 250);
        });
    }
    
    /**
     * Setup accessibility features
     */
    function setupAccessibility() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        testimonialCards.forEach(card => {
            // Add ARIA attributes
            card.setAttribute('role', 'article');
            card.setAttribute('aria-label', 'Testimonial from client');
            
            // Make focusable
            card.setAttribute('tabindex', '0');
            
            // Add keyboard navigation
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
            
            // Focus styles
            card.addEventListener('focus', function() {
                this.style.outline = '2px solid var(--primary-color)';
                this.style.outlineOffset = '4px';
            });
            
            card.addEventListener('blur', function() {
                this.style.outline = '';
                this.style.outlineOffset = '';
            });
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Public API
    window.TestimonialAnimations = {
        refresh: function() {
            animatedElements.clear();
            if (observer) {
                observer.disconnect();
            }
            init();
        },
        config: config
    };
    
})();