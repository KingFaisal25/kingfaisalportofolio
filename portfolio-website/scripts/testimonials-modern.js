class ModernTestimonials {
  constructor() {
    this.carousel = document.querySelector('.testimonials-carousel');
    this.cards = document.querySelectorAll('.testimonial-card');
    this.prevBtn = document.querySelector('.carousel-btn.prev');
    this.nextBtn = document.querySelector('.carousel-btn.next');
    this.dots = document.querySelectorAll('.dot');
    
    this.currentIndex = 0;
    this.isAutoScrolling = true;
    this.autoScrollInterval = null;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }

  init() {
    this.createControls();
    this.setupEventListeners();
    this.startAutoScroll();
    this.createFloatingElements();
    this.animateCardsOnLoad();
    this.setupIntersectionObserver();
  }

  createControls() {
    // Create navigation controls if they don't exist
    if (!this.prevBtn || !this.nextBtn) {
      const controlsContainer = document.createElement('div');
      controlsContainer.className = 'carousel-controls';
      
      this.prevBtn = document.createElement('button');
      this.prevBtn.className = 'carousel-btn prev';
      this.prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
      this.prevBtn.setAttribute('aria-label', 'Testimonial sebelumnya');
      
      this.nextBtn = document.createElement('button');
      this.nextBtn.className = 'carousel-btn next';
      this.nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
      this.nextBtn.setAttribute('aria-label', 'Testimonial berikutnya');
      
      controlsContainer.appendChild(this.prevBtn);
      controlsContainer.appendChild(this.nextBtn);
      
      this.carousel.parentNode.appendChild(controlsContainer);
    }

    // Create dots if they don't exist
    if (this.dots.length === 0) {
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'carousel-dots';
      
      this.cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.setAttribute('data-index', index);
        if (index === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
      });
      
      this.carousel.parentNode.appendChild(dotsContainer);
      this.dots = document.querySelectorAll('.dot');
    }
  }

  setupEventListeners() {
    // Navigation buttons
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());

    // Dot indicators
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Touch events for mobile
    this.carousel.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
      this.stopAutoScroll();
    });

    this.carousel.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
      this.startAutoScroll();
    });

    // Mouse enter/leave for auto-scroll pause
    this.carousel.addEventListener('mouseenter', () => this.stopAutoScroll());
    this.carousel.addEventListener('mouseleave', () => this.startAutoScroll());

    // Focus management for accessibility
    this.cards.forEach(card => {
      card.addEventListener('focus', () => this.stopAutoScroll());
      card.addEventListener('blur', () => this.startAutoScroll());
    });
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCard(entry.target);
        }
      });
    }, observerOptions);

    this.cards.forEach(card => {
      observer.observe(card);
    });
  }

  animateCardsOnLoad() {
    this.cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(50px) scale(0.9)';
      
      setTimeout(() => {
        this.animateCard(card);
      }, index * 200);
    });
  }

  animateCard(card) {
    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0) scale(1)';
    
    // Add subtle stagger effect
    const stars = card.querySelectorAll('.star');
    stars.forEach((star, index) => {
      star.style.animationDelay = `${index * 0.2}s`;
    });
  }

  createFloatingElements() {
    const section = document.querySelector('.testimonials-section');
    
    // Create floating quotes
    for (let i = 0; i < 3; i++) {
      const quote = document.createElement('div');
      quote.className = 'testimonial-floating quote';
      quote.textContent = '"';
      quote.style.left = `${Math.random() * 90 + 5}%`;
      quote.style.top = `${Math.random() * 80 + 10}%`;
      quote.style.animationDelay = `${Math.random() * 6}s`;
      section.appendChild(quote);
    }

    // Create floating stars
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('div');
      star.className = 'testimonial-floating star';
      star.innerHTML = '⭐';
      star.style.left = `${Math.random() * 90 + 5}%`;
      star.style.top = `${Math.random() * 80 + 10}%`;
      star.style.animationDelay = `${Math.random() * 6}s`;
      section.appendChild(star);
    }
  }

  startAutoScroll() {
    if (this.autoScrollInterval || !this.isAutoScrolling) return;
    
    this.autoScrollInterval = setInterval(() => {
      this.next();
    }, 8000);
  }

  stopAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  next() {
    this.goToSlide((this.currentIndex + 1) % this.cards.length);
  }

  prev() {
    this.goToSlide((this.currentIndex - 1 + this.cards.length) % this.cards.length);
  }

  goToSlide(index) {
    if (index === this.currentIndex) return;
    
    // Update current index
    this.currentIndex = index;
    
    // Calculate scroll position
    const cardWidth = this.cards[0].offsetWidth + parseInt(getComputedStyle(this.cards[0]).marginRight);
    const scrollPosition = index * cardWidth;
    
    // Smooth scroll
    this.carousel.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    
    // Update active dot
    this.updateDots();
    
    // Animate card focus
    this.animateCardFocus();
    
    // Update ARIA live region for screen readers
    this.updateAriaLive();
  }

  updateDots() {
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }

  animateCardFocus() {
    // Reset all cards
    this.cards.forEach(card => {
      card.style.transform = 'scale(0.95)';
      card.style.zIndex = '1';
    });
    
    // Animate current card
    const currentCard = this.cards[this.currentIndex];
    currentCard.style.transform = 'scale(1.02)';
    currentCard.style.zIndex = '2';
    
    // Add focus animation
    currentCard.animate([
      { boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' },
      { boxShadow: '0 25px 50px rgba(59, 130, 246, 0.4)' },
      { boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }
    ], {
      duration: 600,
      easing: 'ease-in-out'
    });
  }

  updateAriaLive() {
    const currentCard = this.cards[this.currentIndex];
    const clientName = currentCard.querySelector('h4').textContent;
    const testimonialText = currentCard.querySelector('p').textContent;
    
    // Create or update ARIA live region
    let liveRegion = document.getElementById('testimonial-aria-live');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'testimonial-aria-live';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.padding = '0';
      liveRegion.style.overflow = 'hidden';
      liveRegion.style.clip = 'rect(0, 0, 0, 0)';
      liveRegion.style.whiteSpace = 'nowrap';
      liveRegion.style.border = '0';
      document.body.appendChild(liveRegion);
    }
    
    liveRegion.textContent = `Testimonial dari ${clientName}: ${testimonialText}`;
  }

  // Utility method for smooth animations
  animateElement(element, keyframes, options) {
    return element.animate(keyframes, {
      duration: 600,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards',
      ...options
    });
  }

  // Destroy method for cleanup
  destroy() {
    this.stopAutoScroll();
    
    if (this.prevBtn) this.prevBtn.removeEventListener('click', this.prev);
    if (this.nextBtn) this.nextBtn.removeEventListener('click', this.next);
    
    this.dots.forEach(dot => {
      dot.removeEventListener('click', this.goToSlide);
    });
    
    document.removeEventListener('keydown', this.handleKeydown);
    this.carousel.removeEventListener('touchstart', this.handleTouchStart);
    this.carousel.removeEventListener('touchend', this.handleTouchEnd);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait for Font Awesome to load if needed
  if (typeof FontAwesome !== 'undefined') {
    FontAwesome.config.autoReplaceSvg = 'nest';
  }
  
  new ModernTestimonials();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModernTestimonials;
}