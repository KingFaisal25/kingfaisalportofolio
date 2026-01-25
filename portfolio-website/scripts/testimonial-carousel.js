// Testimonial Carousel Controller
class TestimonialCarousel {
  constructor() {
    this.carousel = document.querySelector('.testimonials-carousel');
    this.cards = document.querySelectorAll('.testimonial-card');
    this.controls = document.querySelector('.carousel-controls');
    this.currentIndex = 0;
    this.autoScrollInterval = null;
    this.isAutoScrolling = true;
    
    this.init();
  }
  
  init() {
    if (!this.carousel || this.cards.length === 0) return;
    
    this.setupCarousel();
    this.createControls();
    this.startAutoScroll();
    this.setupEventListeners();
    this.animateStars();
  }
  
  setupCarousel() {
    // Set initial active state
    this.cards.forEach((card, index) => {
      card.style.setProperty('--card-index', index);
      if (index === 0) {
        card.classList.add('active');
      }
    });
    
    // Add auto-scroll class for CSS animation
    this.carousel.classList.add('auto-scroll');
  }
  
  createControls() {
    if (!this.controls) return;
    
    this.controls.innerHTML = '';
    
    this.cards.forEach((_, index) => {
      const btn = document.createElement('button');
      btn.className = 'carousel-btn';
      btn.setAttribute('aria-label', `Lihat testimoni ${index + 1}`);
      if (index === 0) btn.classList.add('active');
      
      btn.addEventListener('click', () => {
        this.goToSlide(index);
        this.pauseAutoScroll();
        setTimeout(() => this.resumeAutoScroll(), 5000);
      });
      
      this.controls.appendChild(btn);
    });
  }
  
  goToSlide(index) {
    if (index < 0) index = this.cards.length - 1;
    if (index >= this.cards.length) index = 0;
    
    // Update active card
    this.cards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });
    
    // Update active control
    const buttons = this.controls.querySelectorAll('.carousel-btn');
    buttons.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
    
    this.currentIndex = index;
    
    // Trigger custom event
    this.dispatchSlideChangeEvent(index);
  }
  
  nextSlide() {
    this.goToSlide(this.currentIndex + 1);
  }
  
  prevSlide() {
    this.goToSlide(this.currentIndex - 1);
  }
  
  startAutoScroll() {
    if (this.autoScrollInterval) clearInterval(this.autoScrollInterval);
    
    this.autoScrollInterval = setInterval(() => {
      if (this.isAutoScrolling) {
        this.nextSlide();
      }
    }, 5000); // Change slide every 5 seconds
  }
  
  pauseAutoScroll() {
    this.isAutoScrolling = false;
  }
  
  resumeAutoScroll() {
    this.isAutoScrolling = true;
  }
  
  setupEventListeners() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') this.nextSlide();
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === ' ') this.toggleAutoScroll();
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      this.pauseAutoScroll();
    });
    
    this.carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
      setTimeout(() => this.resumeAutoScroll(), 3000);
    });
    
    // Mouse wheel navigation
    this.carousel.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        if (e.deltaX > 0) this.nextSlide();
        else this.prevSlide();
        this.pauseAutoScroll();
        setTimeout(() => this.resumeAutoScroll(), 3000);
      }
    });
    
    // Pause auto-scroll on hover
    this.carousel.addEventListener('mouseenter', () => {
      this.pauseAutoScroll();
    });
    
    this.carousel.addEventListener('mouseleave', () => {
      this.resumeAutoScroll();
    });
  }
  
  handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide(); // Swipe left
      } else {
        this.prevSlide(); // Swipe right
      }
    }
  }
  
  toggleAutoScroll() {
    this.isAutoScrolling = !this.isAutoScrolling;
  }
  
  animateStars() {
    const ratings = document.querySelectorAll('.rating');
    
    ratings.forEach(rating => {
      const stars = rating.querySelectorAll('i');
      stars.forEach((star, index) => {
        star.style.setProperty('--star-index', index);
      });
    });
  }
  
  dispatchSlideChangeEvent(index) {
    const event = new CustomEvent('testimonialSlideChange', {
      detail: { 
        index, 
        total: this.cards.length,
        card: this.cards[index]
      }
    });
    
    document.dispatchEvent(event);
  }
  
  destroy() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
    
    // Remove event listeners
    document.removeEventListener('keydown', this.boundKeyHandler);
    this.carousel.removeEventListener('touchstart', this.boundTouchStart);
    this.carousel.removeEventListener('touchend', this.boundTouchEnd);
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait for AOS to complete initial animations
  setTimeout(() => {
    const carousel = new TestimonialCarousel();
    
    // Make carousel globally accessible for debugging
    window.testimonialCarousel = carousel;
    
    // Add resize handler for responsive adjustments
    window.addEventListener('resize', () => {
      carousel.pauseAutoScroll();
      setTimeout(() => carousel.resumeAutoScroll(), 1000);
    });
    
  }, 1000); // Delay to ensure AOS animations complete
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TestimonialCarousel;
}