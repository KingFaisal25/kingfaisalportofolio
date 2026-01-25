// ===== ROTATING IMAGE CONTROLLER =====
// Advanced control system for rotating image component

class RotatingImageController {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.image = this.container?.querySelector('.rotating-image');
        this.playBtn = this.container?.querySelector('.play-btn');
        this.pauseBtn = this.container?.querySelector('.pause-btn');
        this.speedSlider = this.container?.querySelector('.speed-slider');
        this.speedValue = this.container?.querySelector('.speed-value');
        
        this.isPlaying = true;
        this.currentSpeed = 1.0; // Default speed (1x)
        
        this.init();
    }
    
    init() {
        if (!this.image || !this.playBtn || !this.pauseBtn || !this.speedSlider) {
            console.warn('Rotating image elements not found');
            return;
        }
        
        // Event listeners
        this.playBtn.addEventListener('click', () => this.play());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.speedSlider.addEventListener('input', (e) => this.changeSpeed(e.target.value));
        
        // Initialize speed display
        this.updateSpeedDisplay();
        
        // Performance optimization
        this.optimizePerformance();
        
        console.log('Rotating Image Controller initialized');
    }
    
    play() {
        if (this.isPlaying) return;
        
        this.image.classList.remove('paused');
        this.playBtn.style.display = 'none';
        this.pauseBtn.style.display = 'flex';
        this.isPlaying = true;
        
        // Smooth transition
        this.image.style.animationPlayState = 'running';
    }
    
    pause() {
        if (!this.isPlaying) return;
        
        this.image.classList.add('paused');
        this.playBtn.style.display = 'flex';
        this.pauseBtn.style.display = 'none';
        this.isPlaying = false;
        
        // Smooth transition
        this.image.style.animationPlayState = 'paused';
    }
    
    changeSpeed(speed) {
        const speedValue = parseFloat(speed);
        this.currentSpeed = speedValue;
        
        // Calculate animation duration (faster speed = shorter duration)
        const baseDuration = 20; // 20 seconds for 1x speed
        const newDuration = baseDuration / speedValue;
        
        // Apply new duration with smooth transition
        this.image.style.animationDuration = `${newDuration}s`;
        
        this.updateSpeedDisplay();
    }
    
    updateSpeedDisplay() {
        if (this.speedValue) {
            this.speedValue.textContent = `${this.currentSpeed.toFixed(1)}x`;
        }
    }
    
    optimizePerformance() {
        // GPU acceleration
        this.image.style.transform = 'translateZ(0)';
        this.container.style.transform = 'translateZ(0)';
        
        // Will-change hints
        this.image.style.willChange = 'transform';
        this.container.style.willChange = 'transform';
        
        // Force hardware acceleration
        this.image.style.backfaceVisibility = 'hidden';
        this.image.style.perspective = '1000px';
    }
    
    // Public methods for external control
    setSpeed(speed) {
        if (this.speedSlider) {
            this.speedSlider.value = speed;
            this.changeSpeed(speed);
        }
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    // Destroy method for cleanup
    destroy() {
        if (this.playBtn) this.playBtn.removeEventListener('click', this.play);
        if (this.pauseBtn) this.pauseBtn.removeEventListener('click', this.pause);
        if (this.speedSlider) this.speedSlider.removeEventListener('input', this.changeSpeed);
    }
}

// Auto-initialize function
document.addEventListener('DOMContentLoaded', function() {
    const rotatingContainers = document.querySelectorAll('.rotating-image-container');
    
    rotatingContainers.forEach((container, index) => {
        const controller = new RotatingImageController(container.id || `rotating-image-${index}`);
        
        // Store reference for external access
        container.rotationController = controller;
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RotatingImageController;
}