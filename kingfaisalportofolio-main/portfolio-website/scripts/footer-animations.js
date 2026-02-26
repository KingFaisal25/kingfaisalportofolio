class ModernFooter {
  constructor() {
    this.footer = document.querySelector('.footer-modern');
    this.backToTop = document.querySelector('.back-to-top');
    this.socialLinks = document.querySelectorAll('.social-link');
    this.footerLinks = document.querySelectorAll('.footer-column a');
    
    this.init();
  }

  init() {
    this.createParticles();
    this.setupEventListeners();
    this.setupIntersectionObserver();
    this.animateSocialLinks();
  }

  createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'footer-particles';
    
    // Create 15 floating particles
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random properties for each particle
      const size = Math.random() * 6 + 2;
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 6;
      const animationDuration = Math.random() * 4 + 4;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${left}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${animationDelay}s`;
      particle.style.animationDuration = `${animationDuration}s`;
      
      particlesContainer.appendChild(particle);
    }
    
    this.footer.appendChild(particlesContainer);
  }

  setupEventListeners() {
    // Back to top functionality
    if (this.backToTop) {
      this.backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        this.scrollToTop();
      });
    }

    // Smooth scroll for footer links
    this.footerLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          this.scrollToSection(href.substring(1));
        }
      });
    });

    // Window scroll event for back to top button
    window.addEventListener('scroll', () => {
      this.toggleBackToTop();
    });
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateFooterElements(entry.target);
        }
      });
    }, observerOptions);

    // Observe footer sections
    const footerSections = this.footer.querySelectorAll('.footer-column, .footer-brand');
    footerSections.forEach(section => {
      observer.observe(section);
    });
  }

  animateFooterElements(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 100);
  }

  animateSocialLinks() {
    this.socialLinks.forEach((link, index) => {
      // Staggered animation
      link.style.opacity = '0';
      link.style.transform = 'scale(0.8) translateY(20px)';
      
      setTimeout(() => {
        link.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        link.style.opacity = '1';
        link.style.transform = 'scale(1) translateY(0)';
      }, index * 100);

      // Hover effects with GSAP-like animation
      link.addEventListener('mouseenter', () => {
        this.animateSocialHover(link, true);
      });

      link.addEventListener('mouseleave', () => {
        this.animateSocialHover(link, false);
      });
    });
  }

  animateSocialHover(link, isHovering) {
    const scale = isHovering ? 1.15 : 1;
    const y = isHovering ? -5 : 0;
    const rotation = isHovering ? Math.random() * 10 - 5 : 0;
    
    link.style.transform = `scale(${scale}) translateY(${y}px) rotate(${rotation}deg)`;
    
    if (isHovering) {
      link.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.4)';
    } else {
      link.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
    }
  }

  scrollToTop() {
    this.backToTop.style.transform = 'scale(0.9)';
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    setTimeout(() => {
      this.backToTop.style.transform = 'scale(1)';
    }, 300);
  }

  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const offsetTop = section.offsetTop - 80;
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  toggleBackToTop() {
    if (!this.backToTop) return;
    
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    if (scrollY > windowHeight * 0.5) {
      this.backToTop.style.opacity = '1';
      this.backToTop.style.visibility = 'visible';
      this.backToTop.style.pointerEvents = 'auto';
    } else {
      this.backToTop.style.opacity = '0';
      this.backToTop.style.visibility = 'hidden';
      this.backToTop.style.pointerEvents = 'none';
    }
  }

  // Utility method for smooth animations
  animateElement(element, properties, duration = 300) {
    return new Promise((resolve) => {
      element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      
      Object.keys(properties).forEach(prop => {
        element.style[prop] = properties[prop];
      });
      
      setTimeout(() => {
        resolve();
      }, duration);
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ModernFooter();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModernFooter;
}