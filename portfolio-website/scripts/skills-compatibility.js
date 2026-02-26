/**
 * ULTRA-MODERN CROSS-BROWSER COMPATIBILITY
 * Polyfills, fallbacks, and browser-specific optimizations
 */

class SkillsCrossBrowserCompatibility {
  constructor() {
    this.browserInfo = this.detectBrowser();
    this.isIE = this.browserInfo.name === 'Internet Explorer';
    this.isEdge = this.browserInfo.name === 'Edge';
    this.isSafari = this.browserInfo.name === 'Safari';
    this.isFirefox = this.browserInfo.name === 'Firefox';
    this.isChrome = this.browserInfo.name === 'Chrome';
    
    this.init();
  }

  init() {
    this.setupPolyfills();
    this.setupBrowserSpecificStyles();
    this.setupFeatureDetection();
    this.setupFallbacks();
    this.setupBrowserOptimizations();
    this.setupCompatibilityTesting();
  }

  // ===== BROWSER DETECTION =====
  detectBrowser() {
    const ua = navigator.userAgent;
    let name = 'Unknown';
    let version = 'Unknown';

    // Chrome
    if (ua.indexOf('Chrome') > -1) {
      name = 'Chrome';
      version = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || 'Unknown';
    }
    // Firefox
    else if (ua.indexOf('Firefox') > -1) {
      name = 'Firefox';
      version = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || 'Unknown';
    }
    // Safari
    else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
      name = 'Safari';
      version = ua.match(/Version\/(\d+\.\d+)/)?.[1] || 'Unknown';
    }
    // Edge
    else if (ua.indexOf('Edge') > -1) {
      name = 'Edge';
      version = ua.match(/Edge\/(\d+\.\d+)/)?.[1] || 'Unknown';
    }
    // Internet Explorer
    else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
      name = 'Internet Explorer';
      version = ua.match(/(?:MSIE |rv:)(\d+\.\d+)/)?.[1] || 'Unknown';
    }

    return { name, version: parseFloat(version) || 0 };
  }

  // ===== POLYFILLS =====
  setupPolyfills() {
    // Intersection Observer polyfill
    this.intersectionObserverPolyfill();
    
    // RequestIdleCallback polyfill
    this.requestIdleCallbackPolyfill();
    
    // CSS Custom Properties polyfill for IE
    this.cssCustomPropertiesPolyfill();
    
    // Smooth scroll polyfill
    this.smoothScrollPolyfill();
    
    // Object.assign polyfill
    this.objectAssignPolyfill();
    
    // Promise polyfill
    this.promisePolyfill();
  }

  intersectionObserverPolyfill() {
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers without IntersectionObserver
      window.IntersectionObserver = function(callback, options) {
        this.callback = callback;
        this.options = options || {};
        this.elements = [];
        
        this.observe = function(element) {
          this.elements.push(element);
          this.checkIntersection();
        };
        
        this.unobserve = function(element) {
          this.elements = this.elements.filter(el => el !== element);
        };
        
        this.checkIntersection = function() {
          this.elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isIntersecting = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isIntersecting) {
              this.callback([{
                target: element,
                isIntersecting: true,
                intersectionRatio: 1
              }]);
            }
          });
        };
        
        // Check on scroll
        window.addEventListener('scroll', this.checkIntersection.bind(this), { passive: true });
        window.addEventListener('resize', this.checkIntersection.bind(this), { passive: true });
      };
    }
  }

  requestIdleCallbackPolyfill() {
    if (!window.requestIdleCallback) {
      window.requestIdleCallback = function(callback, options) {
        const start = performance.now();
        const timeout = options?.timeout || 0;
        
        return setTimeout(() => {
          callback({
            didTimeout: false,
            timeRemaining() {
              return Math.max(0, 50 - (performance.now() - start));
            }
          });
        }, timeout);
      };
      
      window.cancelIdleCallback = function(id) {
        clearTimeout(id);
      };
    }
  }

  cssCustomPropertiesPolyfill() {
    if (this.isIE) {
      // Simple CSS custom properties polyfill for IE
      const rootStyles = getComputedStyle(document.documentElement);
      
      // Replace CSS variables with computed values
      const elements = document.querySelectorAll('*');
      elements.forEach(element => {
        const styles = getComputedStyle(element);
        
        // Check for CSS variables in styles
        for (let i = 0; i < styles.length; i++) {
          const property = styles[i];
          const value = styles.getPropertyValue(property);
          
          if (value.includes('var(--')) {
            // Replace with fallback or computed value
            const fallbackValue = this.getFallbackValue(property);
            element.style.setProperty(property, fallbackValue);
          }
        }
      });
    }
  }

  getFallbackValue(property) {
    // Fallback values for common CSS properties
    const fallbacks = {
      '--primary-500': '#3b82f6',
      '--primary-600': '#2563eb',
      '--accent-500': '#8b5cf6',
      '--neutral-100': '#f3f4f6',
      '--neutral-200': '#e5e7eb',
      '--neutral-800': '#1f2937',
      '--neutral-900': '#111827'
    };
    
    return fallbacks[property] || 'inherit';
  }

  smoothScrollPolyfill() {
    if (!('scrollBehavior' in document.documentElement.style)) {
      // Polyfill for smooth scrolling
      const originalScrollTo = window.scrollTo;
      const originalScrollIntoView = Element.prototype.scrollIntoView;
      
      window.scrollTo = function(options) {
        if (typeof options === 'object' && options.behavior === 'smooth') {
          const start = window.pageYOffset;
          const end = options.top || start;
          const duration = 500;
          const startTime = performance.now();
          
          const scroll = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            window.scrollTo(0, start + (end - start) * easeProgress);
            
            if (progress < 1) {
              requestAnimationFrame(scroll);
            }
          };
          
          requestAnimationFrame(scroll);
        } else {
          originalScrollTo.call(window, options);
        }
      };
      
      Element.prototype.scrollIntoView = function(options) {
        if (typeof options === 'object' && options.behavior === 'smooth') {
          const rect = this.getBoundingClientRect();
          const targetY = window.pageYOffset + rect.top;
          
          window.scrollTo({
            top: targetY,
            behavior: 'smooth'
          });
        } else {
          originalScrollIntoView.call(this, options);
        }
      };
    }
  }

  objectAssignPolyfill() {
    if (typeof Object.assign !== 'function') {
      Object.assign = function(target, ...sources) {
        if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }
        
        const to = Object(target);
        
        sources.forEach(source => {
          if (source != null) {
            for (const key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                to[key] = source[key];
              }
            }
          }
        });
        
        return to;
      };
    }
  }

  promisePolyfill() {
    if (typeof Promise === 'undefined') {
      // Basic Promise polyfill
      window.Promise = function(executor) {
        const self = this;
        self.state = 'pending';
        self.value = undefined;
        self.handlers = [];
        
        function resolve(result) {
          if (self.state === 'pending') {
            self.state = 'fulfilled';
            self.value = result;
            self.handlers.forEach(handle);
            self.handlers = [];
          }
        }
        
        function reject(error) {
          if (self.state === 'pending') {
            self.state = 'rejected';
            self.value = error;
            self.handlers.forEach(handle);
            self.handlers = [];
          }
        }
        
        function handle(handler) {
          if (self.state === 'pending') {
            self.handlers.push(handler);
          } else {
            if (self.state === 'fulfilled' && typeof handler.onFulfilled === 'function') {
              handler.onFulfilled(self.value);
            }
            if (self.state === 'rejected' && typeof handler.onRejected === 'function') {
              handler.onRejected(self.value);
            }
          }
        }
        
        this.then = function(onFulfilled, onRejected) {
          return new Promise((resolve, reject) => {
            handle({
              onFulfilled: function(result) {
                try {
                  resolve(onFulfilled ? onFulfilled(result) : result);
                } catch (ex) {
                  reject(ex);
                }
              },
              onRejected: function(error) {
                try {
                  resolve(onRejected ? onRejected(error) : error);
                } catch (ex) {
                  reject(ex);
                }
              }
            });
          });
        };
        
        executor(resolve, reject);
      };
    }
  }

  // ===== BROWSER-SPECIFIC STYLES =====
  setupBrowserSpecificStyles() {
    // Safari-specific fixes
    if (this.isSafari) {
      this.applySafariFixes();
    }
    
    // Firefox-specific fixes
    if (this.isFirefox) {
      this.applyFirefoxFixes();
    }
    
    // Chrome-specific optimizations
    if (this.isChrome) {
      this.applyChromeOptimizations();
    }
    
    // IE/Edge-specific fixes
    if (this.isIE || this.isEdge) {
      this.applyIEFixes();
    }
  }

  applySafariFixes() {
    const style = document.createElement('style');
    style.textContent = `
      /* Safari backdrop-filter fix */
      .skill-item-ultra {
        -webkit-backdrop-filter: blur(20px);
        backdrop-filter: blur(20px);
      }
      
      /* Safari gradient fix */
      .skill-progress {
        background: -webkit-linear-gradient(left, var(--primary-500), var(--accent-500));
        background: linear-gradient(to right, var(--primary-500), var(--accent-500));
      }
      
      /* Safari transform fix */
      .skill-item-ultra:hover {
        -webkit-transform: translateX(8px) scale(1.02);
        transform: translateX(8px) scale(1.02);
      }
    `;
    document.head.appendChild(style);
  }

  applyFirefoxFixes() {
    const style = document.createElement('style');
    style.textContent = `
      /* Firefox scrollbar styling */
      .skills-container-ultra {
        scrollbar-width: thin;
        scrollbar-color: var(--primary-500) var(--neutral-200);
      }
      
      /* Firefox focus outline fix */
      .skill-item-ultra:focus {
        outline: 2px solid var(--primary-500);
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);
  }

  applyChromeOptimizations() {
    const style = document.createElement('style');
    style.textContent = `
      /* Chrome performance optimization */
      .skill-item-ultra {
        will-change: transform;
        contain: layout style;
      }
      
      /* Chrome smooth scrolling */
      html {
        scroll-behavior: smooth;
      }
      
      /* Chrome GPU acceleration */
      .skill-icon-ultra {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
      }
    `;
    document.head.appendChild(style);
  }

  applyIEFixes() {
    const style = document.createElement('style');
    style.textContent = `
      /* IE flexbox fixes */
      .skills-grid-ultra {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
      }
      
      .skill-item-ultra {
        -ms-flex: 0 0 25%;
        flex: 0 0 25%;
        max-width: 25%;
      }
      
      /* IE gradient fallback */
      .skill-progress {
        background: #3b82f6;
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#3b82f6', endColorstr='#8b5cf6', GradientType=1);
      }
      
      /* IE transform fallback */
      .skill-item-ultra:hover {
        -ms-transform: translateX(8px) scale(1.02);
        transform: translateX(8px) scale(1.02);
      }
    `;
    document.head.appendChild(style);
  }

  // ===== FEATURE DETECTION =====
  setupFeatureDetection() {
    // Detect CSS features
    this.detectCSSFeatures();
    
    // Detect JavaScript features
    this.detectJSFeatures();
    
    // Detect HTML5 features
    this.detectHTML5Features();
    
    // Apply fallbacks based on detected features
    this.applyFeatureFallbacks();
  }

  detectCSSFeatures() {
    const features = {
      grid: this.checkCSSFeature('display: grid'),
      flexbox: this.checkCSSFeature('display: flex'),
      customProperties: this.checkCSSFeature('--test: 1'),
      backdropFilter: this.checkCSSFeature('backdrop-filter: blur(1px)'),
      clipPath: this.checkCSSFeature('clip-path: circle(50%)'),
      gradients: this.checkCSSFeature('background: linear-gradient(red, blue)'),
      transforms: this.checkCSSFeature('transform: translateX(1px)'),
      animations: this.checkCSSFeature('animation: test 1s')
    };
    
    // Add feature classes to body
    Object.keys(features).forEach(feature => {
      if (features[feature]) {
        document.body.classList.add(`supports-${feature}`);
      } else {
        document.body.classList.add(`no-supports-${feature}`);
      }
    });
    
    return features;
  }

  checkCSSFeature(property) {
    const testElement = document.createElement('div');
    testElement.style.cssText = property;
    return testElement.style.length > 0;
  }

  detectJSFeatures() {
    const features = {
      promises: typeof Promise !== 'undefined',
      fetch: typeof fetch !== 'undefined',
      intersectionObserver: typeof IntersectionObserver !== 'undefined',
      requestIdleCallback: typeof requestIdleCallback !== 'undefined',
      webAnimations: typeof Element.prototype.animate !== 'undefined',
      serviceWorker: 'serviceWorker' in navigator,
      webp: this.checkWebPSupport()
    };
    
    return features;
  }

  checkWebPSupport() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  detectHTML5Features() {
    const features = {
      localStorage: this.checkLocalStorage(),
      sessionStorage: this.checkSessionStorage(),
      webWorkers: typeof Worker !== 'undefined',
      geolocation: 'geolocation' in navigator,
      historyAPI: !!(window.history && window.history.pushState),
      canvas: !!document.createElement('canvas').getContext,
      svg: !!(document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect)
    };
    
    return features;
  }

  checkLocalStorage() {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  }

  checkSessionStorage() {
    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  }

  applyFeatureFallbacks() {
    // Grid fallback for older browsers
    if (!this.checkCSSFeature('display: grid')) {
      this.applyGridFallback();
    }
    
    // Flexbox fallback for very old browsers
    if (!this.checkCSSFeature('display: flex')) {
      this.applyFlexboxFallback();
    }
    
    // Custom properties fallback
    if (!this.checkCSSFeature('--test: 1')) {
      this.applyCustomPropertiesFallback();
    }
    
    // WebP fallback
    this.webpSupport.then(supported => {
      if (!supported) {
        this.applyWebPFallback();
      }
    });
  }

  applyGridFallback() {
    const style = document.createElement('style');
    style.textContent = `
      /* Grid fallback using flexbox */
      .skills-grid-ultra {
        display: flex;
        flex-wrap: wrap;
        margin: -0.75rem;
      }
      
      .skill-item-ultra {
        flex: 0 0 calc(25% - 1.5rem);
        margin: 0.75rem;
        max-width: calc(25% - 1.5rem);
      }
      
      @media (max-width: 1200px) {
        .skill-item-ultra {
          flex: 0 0 calc(33.333% - 1.5rem);
          max-width: calc(33.333% - 1.5rem);
        }
      }
      
      @media (max-width: 768px) {
        .skill-item-ultra {
          flex: 0 0 calc(50% - 1.5rem);
          max-width: calc(50% - 1.5rem);
        }
      }
      
      @media (max-width: 480px) {
        .skill-item-ultra {
          flex: 0 0 calc(100% - 1.5rem);
          max-width: calc(100% - 1.5rem);
        }
      }
    `;
    document.head.appendChild(style);
  }

  applyFlexboxFallback() {
    const style = document.createElement('style');
    style.textContent = `
      /* Flexbox fallback using inline-block */
      .skills-grid-ultra {
        text-align: center;
        margin: -0.75rem;
      }
      
      .skill-item-ultra {
        display: inline-block;
        width: calc(25% - 1.5rem);
        margin: 0.75rem;
        vertical-align: top;
      }
      
      .category-header-ultra {
        text-align: center;
      }
      
      .category-icon-ultra,
      .category-content-ultra {
        display: inline-block;
        vertical-align: middle;
      }
    `;
    document.head.appendChild(style);
  }

  applyCustomPropertiesFallback() {
    // Replace CSS variables with static values
    const replacements = {
      'var(--primary-500)': '#3b82f6',
      'var(--primary-600)': '#2563eb',
      'var(--accent-500)': '#8b5cf6',
      'var(--neutral-100)': '#f3f4f6',
      'var(--neutral-200)': '#e5e7eb',
      'var(--neutral-800)': '#1f2937',
      'var(--neutral-900)': '#111827'
    };
    
    // Create fallback stylesheet
    let cssText = '';
    Object.keys(replacements).forEach(variable => {
      cssText += `
        .skill-item-ultra,
        .skill-category-ultra,
        .cta-button {
          ${variable.replace('var(', '').replace(')', '')}: ${replacements[variable]};
        }
      `;
    });
    
    const style = document.createElement('style');
    style.textContent = cssText;
    document.head.appendChild(style);
  }

  applyWebPFallback() {
    // Replace WebP images with JPEG/PNG fallbacks
    const images = document.querySelectorAll('img[data-src]');
    
    images.forEach(img => {
      const src = img.dataset.src;
      if (src && src.includes('.webp')) {
        // Replace with JPEG fallback
        img.dataset.src = src.replace('.webp', '.jpg');
      }
    });
  }

  // ===== FALLBACKS =====
  setupFallbacks() {
    // Animation fallbacks
    this.setupAnimationFallbacks();
    
    // Transition fallbacks
    this.setupTransitionFallbacks();
    
    // Transform fallbacks
    this.setupTransformFallbacks();
    
    // Gradient fallbacks
    this.setupGradientFallbacks();
  }

  setupAnimationFallbacks() {
    if (!this.checkCSSFeature('animation: test 1s')) {
      // JavaScript-based animation fallback
      const animateElements = () => {
        const elements = document.querySelectorAll('.skill-item-ultra');
        
        elements.forEach((element, index) => {
          setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          }, index * 100);
        });
      };
      
      // Trigger animations after page load
      window.addEventListener('load', animateElements);
    }
  }

  setupTransitionFallbacks() {
    if (!this.checkCSSFeature('transition: all 0.3s')) {
      // JavaScript-based transition fallback
      const addHoverEffects = () => {
        const skillItems = document.querySelectorAll('.skill-item-ultra');
        
        skillItems.forEach(item => {
          item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = '#f3f4f6';
          });
          
          item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = '';
          });
        });
      };
      
      document.addEventListener('DOMContentLoaded', addHoverEffects);
    }
  }

  setupTransformFallbacks() {
    if (!this.checkCSSFeature('transform: translateX(1px)')) {
      // Fallback for browsers without transform support
      const style = document.createElement('style');
      style.textContent = `
        .skill-item-ultra:hover {
          margin-left: 8px;
        }
        
        .skill-icon-ultra {
          display: inline-block;
          vertical-align: middle;
        }
      `;
      document.head.appendChild(style);
    }
  }

  setupGradientFallbacks() {
    if (!this.checkCSSFeature('background: linear-gradient(red, blue)')) {
      // Solid color fallback for gradients
      const style = document.createElement('style');
      style.textContent = `
        .skill-progress {
          background: #3b82f6;
        }
        
        .skill-item-ultra {
          background: #ffffff;
          border: 1px solid #e5e7eb;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ===== BROWSER OPTIMIZATIONS =====
  setupBrowserOptimizations() {
    // Optimize for each browser's rendering engine
    if (this.isChrome) {
      this.optimizeForChrome();
    }
    
    if (this.isFirefox) {
      this.optimizeForFirefox();
    }
    
    if (this.isSafari) {
      this.optimizeForSafari();
    }
    
    if (this.isIE || this.isEdge) {
      this.optimizeForIE();
    }
  }

  optimizeForChrome() {
    // Chrome-specific optimizations
    const style = document.createElement('style');
    style.textContent = `
      /* Chrome GPU acceleration */
      .skill-item-ultra {
        will-change: transform;
        contain: layout style;
      }
      
      /* Chrome smooth animations */
      .skill-progress {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
    `;
    document.head.appendChild(style);
  }

  optimizeForFirefox() {
    // Firefox-specific optimizations
    const style = document.createElement('style');
    style.textContent = `
      /* Firefox performance optimization */
      .skills-grid-ultra {
        -moz-user-select: none;
        user-select: none;
      }
      
      /* Firefox scrollbar optimization */
      .skills-container-ultra {
        scrollbar-width: thin;
        scrollbar-color: #3b82f6 #e5e7eb;
      }
    `;
    document.head.appendChild(style);
  }

  optimizeForSafari() {
    // Safari-specific optimizations
    const style = document.createElement('style');
    style.textContent = `
      /* Safari memory optimization */
      .skill-item-ultra {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
      }
      
      /* Safari rendering optimization */
      .skill-icon-ultra {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    `;
    document.head.appendChild(style);
  }

  optimizeForIE() {
    // IE-specific optimizations
    const style = document.createElement('style');
    style.textContent = `
      /* IE performance optimization */
      .skill-item-ultra {
        zoom: 1;
        filter: alpha(opacity=100);
      }
      
      /* IE layout optimization */
      .skills-grid-ultra {
        display: block;
        font-size: 0;
      }
      
      .skill-item-ultra {
        display: inline-block;
        font-size: 1rem;
        vertical-align: top;
      }
    `;
    document.head.appendChild(style);
  }

  // ===== COMPATIBILITY TESTING =====
  setupCompatibilityTesting() {
    // Add browser info to body for testing
    document.body.classList.add(`browser-${this.browserInfo.name.toLowerCase()}`);
    document.body.classList.add(`browser-version-${Math.floor(this.browserInfo.version)}`);
    
    // Test critical features
    this.testCriticalFeatures();
    
    // Log compatibility info
    this.logCompatibilityInfo();
  }

  testCriticalFeatures() {
    const criticalFeatures = [
      'querySelector',
      'addEventListener',
      'classList',
      'getBoundingClientRect',
      'requestAnimationFrame'
    ];
    
    const unsupportedFeatures = criticalFeatures.filter(feature => {
      return typeof document[feature] === 'undefined' && typeof window[feature] === 'undefined';
    });
    
    if (unsupportedFeatures.length > 0) {
      console.warn('Unsupported critical features:', unsupportedFeatures);
      this.showCompatibilityWarning(unsupportedFeatures);
    }
  }

  showCompatibilityWarning(unsupportedFeatures) {
    const warning = document.createElement('div');
    warning.className = 'compatibility-warning';
    warning.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #fef3c7;
        color: #92400e;
        padding: 1rem;
        text-align: center;
        z-index: 9999;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 0.875rem;
        line-height: 1.5;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      ">
        <strong>Browser Compatibility Warning:</strong> Some features may not work correctly in your browser.
        Please consider updating to a modern browser for the best experience.
      </div>
    `;
    
    document.body.appendChild(warning);
  }

  logCompatibilityInfo() {
    console.log('Browser Compatibility Info:', {
      browser: this.browserInfo,
      features: {
        css: this.detectCSSFeatures(),
        js: this.detectJSFeatures(),
        html5: this.detectHTML5Features()
      }
    });
  }

  // ===== UTILITY METHODS =====
  getBrowserInfo() {
    return this.browserInfo;
  }

  isFeatureSupported(feature) {
    const features = {
      ...this.detectCSSFeatures(),
      ...this.detectJSFeatures(),
      ...this.detectHTML5Features()
    };
    
    return features[feature] || false;
  }

  showBrowserSupportTable() {
    const supportTable = {
      'Chrome 80+': { grid: true, flexbox: true, animations: true, webp: true },
      'Firefox 75+': { grid: true, flexbox: true, animations: true, webp: true },
      'Safari 13+': { grid: true, flexbox: true, animations: true, webp: true },
      'Edge 80+': { grid: true, flexbox: true, animations: true, webp: true },
      'IE 11': { grid: false, flexbox: true, animations: false, webp: false }
    };
    
    console.table(supportTable);
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  window.skillsCompatibility = new SkillsCrossBrowserCompatibility();
});

// ===== EXPORT FOR MODULE SYSTEMS =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SkillsCrossBrowserCompatibility;
}