/**
 * Audio Controls & Lazy Loading Module
 * Handles background audio loading, volume control, and user interactions
 * 
 * Features:
 * - Lazy loading audio to prevent blocking page load
 * - Volume control with slider
 * - Play/pause toggle with visual feedback
 * - User preference persistence using localStorage
 * - Accessibility support
 * - Mobile-optimized controls
 */

(function() {
    'use strict';
    
    // Audio elements and controls
    const audio = document.getElementById('bgAudio');
    const audioToggle = document.getElementById('audioToggle');
    const volumeSlider = document.getElementById('volumeSlider');
    const audioControls = document.getElementById('audioControls');
    
    // Check if audio elements exist
    if (!audio || !audioToggle || !volumeSlider || !audioControls) {
        console.warn('Audio elements not found - audio controls disabled');
        return;
    }
    
    // Configuration
    const config = {
        defaultVolume: 0.3,
        fadeDuration: 2000,
        storageKey: 'audioPreferences',
        autoplayDelay: 3000 // Delay autoplay to allow page load
    };
    
    // State management
    let isPlaying = false;
    let isMuted = false;
    let userInteracted = false;
    let audioLoaded = false;
    let autoplayTimeout = null;
    
    /**
     * Load user preferences from localStorage
     */
    function loadPreferences() {
        try {
            const preferences = JSON.parse(localStorage.getItem(config.storageKey)) || {};
            return {
                volume: preferences.volume || config.defaultVolume,
                muted: preferences.muted || false,
                autoplay: preferences.autoplay !== false, // Default true
                lastInteraction: preferences.lastInteraction || 0
            };
        } catch (error) {
            console.warn('Failed to load audio preferences:', error);
            return {
                volume: config.defaultVolume,
                muted: false,
                autoplay: true,
                lastInteraction: 0
            };
        }
    }
    
    /**
     * Save user preferences to localStorage
     */
    function savePreferences(preferences) {
        try {
            localStorage.setItem(config.storageKey, JSON.stringify(preferences));
        } catch (error) {
            console.warn('Failed to save audio preferences:', error);
        }
    }
    
    /**
     * Initialize audio with user preferences
     */
    function initializeAudio() {
        const preferences = loadPreferences();
        
        // Set initial volume
        audio.volume = preferences.volume;
        volumeSlider.value = preferences.volume * 100;
        
        // Set muted state
        if (preferences.muted) {
            audio.muted = true;
            isMuted = true;
            updateUI();
        }
        
        // Check if enough time has passed since last interaction
        const now = Date.now();
        const timeSinceLastInteraction = now - preferences.lastInteraction;
        const shouldAutoplay = preferences.autoplay && timeSinceLastInteraction > 60000; // 1 minute
        
        // Show controls
        audioControls.style.display = 'flex';
        
        // Setup event listeners
        setupEventListeners();
        
        // Load audio lazily
        loadAudioLazily();
        
        // Schedule autoplay if enabled
        if (shouldAutoplay) {
            scheduleAutoplay();
        }
    }
    
    /**
     * Lazy load audio to prevent blocking page load
     */
    function loadAudioLazily() {
        // Use Intersection Observer to load audio when page is interactive
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !audioLoaded) {
                        loadAudio();
                        observer.disconnect();
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });
            
            observer.observe(audioControls);
        } else {
            // Fallback: load after page load
            window.addEventListener('load', () => {
                setTimeout(loadAudio, 1000);
            });
        }
    }
    
    /**
     * Load audio source
     */
    function loadAudio() {
        if (audioLoaded) return;
        
        // Set preload to auto and load
        audio.preload = 'auto';
        audio.load();
        audioLoaded = true;
        
        console.log('Audio loaded successfully');
    }
    
    /**
     * Schedule autoplay with delay
     */
    function scheduleAutoplay() {
        // Clear existing timeout
        if (autoplayTimeout) {
            clearTimeout(autoplayTimeout);
        }
        
        // Schedule autoplay
        autoplayTimeout = setTimeout(() => {
            if (!userInteracted && !isPlaying) {
                playAudio();
            }
        }, config.autoplayDelay);
    }
    
    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Audio toggle button
        audioToggle.addEventListener('click', toggleAudio);
        audioToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleAudio();
            }
        });
        
        // Volume slider
        volumeSlider.addEventListener('input', handleVolumeChange);
        volumeSlider.addEventListener('change', handleVolumeChange);
        
        // Audio events
        audio.addEventListener('play', () => {
            isPlaying = true;
            updateUI();
        });
        
        audio.addEventListener('pause', () => {
            isPlaying = false;
            updateUI();
        });
        
        audio.addEventListener('ended', () => {
            isPlaying = false;
            updateUI();
        });
        
        audio.addEventListener('volumechange', () => {
            updateVolumeUI();
        });
        
        // User interaction detection
        document.addEventListener('click', handleUserInteraction, { once: true });
        document.addEventListener('touchstart', handleUserInteraction, { once: true });
        document.addEventListener('keydown', handleUserInteraction, { once: true });
        
        // Page visibility change
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Window focus/blur
        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);
    }
    
    /**
     * Handle user interaction
     */
    function handleUserInteraction() {
        if (userInteracted) return;
        
        userInteracted = true;
        
        // Clear autoplay timeout
        if (autoplayTimeout) {
            clearTimeout(autoplayTimeout);
        }
        
        // Load audio if not already loaded
        if (!audioLoaded) {
            loadAudio();
        }
        
        // Update preferences
        const preferences = loadPreferences();
        preferences.lastInteraction = Date.now();
        savePreferences(preferences);
        
        console.log('User interaction detected');
    }
    
    /**
     * Toggle audio play/pause
     */
    function toggleAudio() {
        handleUserInteraction();
        
        if (!audioLoaded) {
            loadAudio();
        }
        
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    }
    
    /**
     * Play audio
     */
    function playAudio() {
        if (!audioLoaded) {
            loadAudio();
        }
        
        audio.play().then(() => {
            isPlaying = true;
            updateUI();
            
            // Update preferences
            const preferences = loadPreferences();
            preferences.autoplay = true;
            savePreferences(preferences);
            
            console.log('Audio playing');
        }).catch(error => {
            console.warn('Failed to play audio:', error);
            // Fallback: show user message
            showAudioError();
        });
    }
    
    /**
     * Pause audio
     */
    function pauseAudio() {
        audio.pause();
        isPlaying = false;
        updateUI();
        
        // Update preferences
        const preferences = loadPreferences();
        preferences.autoplay = false;
        savePreferences(preferences);
        
        console.log('Audio paused');
    }
    
    /**
     * Handle volume change
     */
    function handleVolumeChange(event) {
        const volume = event.target.value / 100;
        audio.volume = volume;
        
        // Update preferences
        const preferences = loadPreferences();
        preferences.volume = volume;
        savePreferences(preferences);
        
        // If volume is 0, mute the audio
        if (volume === 0) {
            audio.muted = true;
            isMuted = true;
        } else if (isMuted) {
            audio.muted = false;
            isMuted = false;
        }
        
        updateUI();
    }
    
    /**
     * Update UI state
     */
    function updateUI() {
        if (isPlaying) {
            audioToggle.classList.add('playing');
            audioToggle.innerHTML = '<i class="fas fa-pause"></i>';
            audioToggle.setAttribute('aria-label', 'Jeda musik latar');
            audioToggle.setAttribute('title', 'Jeda Audio');
        } else {
            audioToggle.classList.remove('playing');
            audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            audioToggle.setAttribute('aria-label', 'Putar musik latar');
            audioToggle.setAttribute('title', 'Putar Audio');
        }
        
        if (isMuted || audio.volume === 0) {
            audioToggle.classList.add('muted');
        } else {
            audioToggle.classList.remove('muted');
        }
        
        updateVolumeUI();
    }
    
    /**
     * Update volume UI
     */
    function updateVolumeUI() {
        volumeSlider.value = audio.volume * 100;
        
        // Update icon based on volume level
        const icon = audioToggle.querySelector('i');
        if (icon) {
            if (audio.volume === 0 || audio.muted) {
                icon.className = 'fas fa-volume-mute';
            } else if (audio.volume < 0.5) {
                icon.className = 'fas fa-volume-down';
            } else {
                icon.className = 'fas fa-volume-up';
            }
        }
    }
    
    /**
     * Handle page visibility change
     */
    function handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - pause audio if playing
            if (isPlaying && !isMuted) {
                audio.pause();
            }
        } else {
            // Page is visible - resume if it was playing
            if (isPlaying && !isMuted && userInteracted) {
                // Resume with fade in
                fadeInAudio();
            }
        }
    }
    
    /**
     * Handle window focus/blur
     */
    function handleFocus() {
        // Window gained focus
        if (isPlaying && !isMuted && userInteracted) {
            fadeInAudio();
        }
    }
    
    function handleBlur() {
        // Window lost focus - pause to save resources
        if (isPlaying && !isMuted) {
            audio.pause();
        }
    }
    
    /**
     * Fade in audio
     */
    function fadeInAudio() {
        if (!audioLoaded) return;
        
        const targetVolume = loadPreferences().volume;
        let currentVolume = 0;
        audio.volume = currentVolume;
        
        audio.play().then(() => {
            const fadeInterval = setInterval(() => {
                currentVolume += targetVolume / (config.fadeDuration / 100);
                if (currentVolume >= targetVolume) {
                    audio.volume = targetVolume;
                    clearInterval(fadeInterval);
                } else {
                    audio.volume = currentVolume;
                }
            }, 100);
        }).catch(error => {
            console.warn('Failed to fade in audio:', error);
        });
    }
    
    /**
     * Show audio error message
     */
    function showAudioError() {
        // Create error message element
        const errorMsg = document.createElement('div');
        errorMsg.className = 'audio-error-message';
        errorMsg.innerHTML = `
            <div class="audio-error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Tidak dapat memutar audio. Klik untuk mencoba lagi.</span>
            </div>
        `;
        
        // Style the error message
        errorMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(239, 68, 68, 0.9);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 1001;
            cursor: pointer;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(errorMsg);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorMsg.parentNode) {
                errorMsg.style.opacity = '0';
                setTimeout(() => errorMsg.remove(), 300);
            }
        }, 5000);
        
        // Click to retry
        errorMsg.addEventListener('click', () => {
            errorMsg.remove();
            playAudio();
        });
    }
    
    /**
     * Initialize when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAudio);
    } else {
        initializeAudio();
    }
    
    // Expose API for external use
    window.audioControls = {
        play: playAudio,
        pause: pauseAudio,
        toggle: toggleAudio,
        setVolume: (volume) => {
            audio.volume = Math.max(0, Math.min(1, volume));
            volumeSlider.value = audio.volume * 100;
            handleVolumeChange({ target: { value: audio.volume * 100 } });
        },
        getVolume: () => audio.volume,
        isPlaying: () => isPlaying,
        isMuted: () => isMuted || audio.volume === 0
    };
    
})();