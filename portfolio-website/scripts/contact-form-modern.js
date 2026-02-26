// Modern Contact Form JavaScript - World Class Interactivity

class ModernContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.formContainer = document.querySelector('.contact-form-container');
        this.fields = {};
        this.isSubmitting = false;
        
        this.init();
    }

    init() {
        if (!this.form) return;

        this.cacheElements();
        this.setupEventListeners();
        this.setupFormSteps();
        this.setupRealTimeValidation();
        this.setupAccessibility();
        this.setupMicroInteractions();
    }

    cacheElements() {
        // Cache all form fields
        this.fields = {
            name: this.form.querySelector('#name'),
            email: this.form.querySelector('#email'),
            subject: this.form.querySelector('#subject'),
            service: this.form.querySelector('#service'),
            message: this.form.querySelector('#message'),
            submit: this.form.querySelector('.submit-btn-modern'),
            status: this.form.querySelector('.status-message')
        };

        // Cache form steps
        this.formSteps = this.formContainer.querySelectorAll('.form-step');
        this.formIcons = this.formContainer.querySelectorAll('.icon-badge');
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Input focus/blur events for animations
        Object.values(this.fields).forEach(field => {
            if (field && field.tagName !== 'BUTTON' && field.tagName !== 'DIV') {
                field.addEventListener('focus', (e) => this.handleFocus(e));
                field.addEventListener('blur', (e) => this.handleBlur(e));
                field.addEventListener('input', (e) => this.handleInput(e));
            }
        });

        // Keyboard navigation
        this.form.addEventListener('keydown', (e) => this.handleKeyNavigation(e));

        // Service select change
        if (this.fields.service) {
            this.fields.service.addEventListener('change', (e) => this.handleServiceChange(e));
        }
    }

    setupFormSteps() {
        // Animate form steps on scroll into view
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateFormSteps();
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (this.formContainer) {
            observer.observe(this.formContainer);
        }
    }

    setupRealTimeValidation() {
        // Real-time validation patterns
        const validationPatterns = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            name: /^[a-zA-Z\s]{2,50}$/,
            subject: /^.{5,100}$/,
            message: /^.{10,2000}$/
        };

        // Add validation to each field
        Object.entries(this.fields).forEach(([key, field]) => {
            if (field && validationPatterns[key]) {
                field.addEventListener('blur', () => this.validateField(key, field, validationPatterns[key]));
            }
        });
    }

    setupAccessibility() {
        // Add ARIA attributes
        Object.entries(this.fields).forEach(([key, field]) => {
            if (field && field.id) {
                const label = this.form.querySelector(`label[for="${field.id}"]`);
                if (label) {
                    field.setAttribute('aria-labelledby', label.id || this.createAriaId(label));
                }
            }
        });

        // Focus management
        this.form.setAttribute('role', 'form');
        this.form.setAttribute('aria-label', 'Contact form for project inquiries');
    }

    setupMicroInteractions() {
        // Hover effects for icons
        this.formIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => this.animateIcon(icon, 'enter'));
            icon.addEventListener('mouseleave', () => this.animateIcon(icon, 'leave'));
        });

        // Submit button hover effect
        if (this.fields.submit) {
            this.fields.submit.addEventListener('mouseenter', () => this.animateSubmitButton('enter'));
            this.fields.submit.addEventListener('mouseleave', () => this.animateSubmitButton('leave'));
        }
    }

    // ===== EVENT HANDLERS =====

    handleSubmit(e) {
        e.preventDefault();

        if (this.isSubmitting) return;

        // Validate all fields
        const isValid = this.validateAllFields();
        
        if (!isValid) {
            this.showStatus('Please fill all required fields correctly.', 'error');
            this.shakeForm();
            return;
        }

        this.isSubmitting = true;
        this.setSubmitState('submitting');

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            this.handleFormSuccess();
        }, 2000);
    }

    handleFocus(e) {
        const field = e.target;
        const fieldContainer = field.closest('.form-field');
        
        if (fieldContainer) {
            fieldContainer.classList.add('focused');
            this.animateField(field, 'focus');
        }
    }

    handleBlur(e) {
        const field = e.target;
        const fieldContainer = field.closest('.form-field');
        
        if (fieldContainer) {
            fieldContainer.classList.remove('focused');
            this.animateField(field, 'blur');
        }
    }

    handleInput(e) {
        const field = e.target;
        this.clearFieldStatus(field);
    }

    handleKeyNavigation(e) {
        // Tab navigation with custom focus styling
        if (e.key === 'Tab') {
            setTimeout(() => {
                const activeElement = document.activeElement;
                if (this.form.contains(activeElement)) {
                    this.highlightActiveField(activeElement);
                }
            }, 10);
        }

        // Enter to submit
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            this.form.dispatchEvent(new Event('submit'));
        }
    }

    handleServiceChange(e) {
        const value = e.target.value;
        this.animateServiceChange(value);
    }

    // ===== VALIDATION METHODS =====

    validateField(fieldName, field, pattern) {
        const value = field.value.trim();
        const fieldContainer = field.closest('.form-field');
        
        if (!fieldContainer) return;

        // Clear previous validation
        fieldContainer.classList.remove('valid', 'invalid');

        if (!value) {
            fieldContainer.classList.add('invalid');
            this.showFieldError(field, 'This field is required');
            return false;
        }

        if (pattern && !pattern.test(value)) {
            fieldContainer.classList.add('invalid');
            this.showFieldError(field, this.getValidationMessage(fieldName));
            return false;
        }

        fieldContainer.classList.add('valid');
        this.showFieldSuccess(field);
        return true;
    }

    validateAllFields() {
        let allValid = true;

        Object.entries(this.fields).forEach(([key, field]) => {
            if (field && field.hasAttribute('required')) {
                const isValid = this.validateField(key, field, this.getValidationPattern(key));
                if (!isValid) allValid = false;
            }
        });

        return allValid;
    }

    getValidationPattern(fieldName) {
        const patterns = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            name: /^[a-zA-Z\s]{2,50}$/,
            subject: /^.{5,100}$/,
            message: /^.{10,2000}$/
        };
        return patterns[fieldName];
    }

    getValidationMessage(fieldName) {
        const messages = {
            email: 'Please enter a valid email address',
            name: 'Name must be 2-50 characters',
            subject: 'Subject must be 5-100 characters',
            message: 'Message must be 10-2000 characters'
        };
        return messages[fieldName] || 'Invalid input';
    }

    // ===== ANIMATION METHODS =====

    animateFormSteps() {
        this.formSteps.forEach((step, index) => {
            setTimeout(() => {
                step.style.opacity = '0';
                step.style.transform = 'translateY(20px)';
                step.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                
                requestAnimationFrame(() => {
                    step.style.opacity = '1';
                    step.style.transform = 'translateY(0)';
                });
            }, index * 200);
        });
    }

    animateField(field, state) {
        const fieldContainer = field.closest('.form-field');
        if (!fieldContainer) return;

        if (state === 'focus') {
            fieldContainer.style.transform = 'translateY(-2px)';
            fieldContainer.style.transition = 'transform 0.3s ease';
        } else {
            fieldContainer.style.transform = 'translateY(0)';
        }
    }

    animateIcon(icon, state) {
        if (state === 'enter') {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.boxShadow = '0 8px 25px rgba(0, 212, 255, 0.4)';
        } else {
            icon.style.transform = 'scale(1) rotate(0)';
            icon.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.3)';
        }
    }

    animateSubmitButton(state) {
        if (!this.fields.submit) return;

        if (state === 'enter') {
            this.fields.submit.style.transform = 'translateY(-2px) scale(1.02)';
            this.fields.submit.style.boxShadow = '0 12px 40px rgba(0, 212, 255, 0.5)';
        } else {
            this.fields.submit.style.transform = 'translateY(0) scale(1)';
            this.fields.submit.style.boxShadow = '0 8px 32px rgba(0, 212, 255, 0.3)';
        }
    }

    animateServiceChange(value) {
        const serviceField = this.fields.service.closest('.form-field');
        if (serviceField) {
            serviceField.style.transform = 'scale(1.02)';
            setTimeout(() => {
                serviceField.style.transform = 'scale(1)';
            }, 300);
        }
    }

    shakeForm() {
        this.formContainer.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            this.formContainer.style.animation = '';
        }, 500);
    }

    // ===== UI FEEDBACK METHODS =====

    setSubmitState(state) {
        if (!this.fields.submit) return;

        const btnText = this.fields.submit.querySelector('.btn-text');
        const btnIcon = this.fields.submit.querySelector('i');

        switch (state) {
            case 'submitting':
                this.fields.submit.disabled = true;
                if (btnText) btnText.textContent = 'Sending...';
                if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin';
                this.fields.submit.style.opacity = '0.8';
                break;
            
            case 'success':
                this.fields.submit.disabled = false;
                if (btnText) btnText.textContent = 'Message Sent!';
                if (btnIcon) btnIcon.className = 'fas fa-check';
                this.fields.submit.style.background = 'linear-gradient(135deg, #51cf66, #2f9e44)';
                break;
            
            case 'error':
                this.fields.submit.disabled = false;
                if (btnText) btnText.textContent = 'Try Again';
                if (btnIcon) btnIcon.className = 'fas fa-paper-plane';
                this.fields.submit.style.background = 'linear-gradient(135deg, #ff6b6b, #c92a2a)';
                break;
            
            default:
                this.fields.submit.disabled = false;
                if (btnText) btnText.textContent = 'Send Message';
                if (btnIcon) btnIcon.className = 'fas fa-paper-plane';
                this.fields.submit.style.background = 'linear-gradient(135deg, #00d4ff, #667eea)';
        }
    }

    showStatus(message, type = 'info') {
        if (!this.fields.status) return;

        this.fields.status.textContent = message;
        this.fields.status.className = `status-message ${type}`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.fields.status.textContent = '';
            this.fields.status.className = 'status-message';
        }, 5000);
    }

    showFieldError(field, message) {
        this.showFieldStatus(field, message, 'error');
    }

    showFieldSuccess(field) {
        this.showFieldStatus(field, '✓ Valid', 'success');
    }

    showFieldStatus(field, message, type) {
        let statusElement = field.nextElementSibling;
        
        if (!statusElement || !statusElement.classList.contains('field-status')) {
            statusElement = document.createElement('div');
            statusElement.className = 'field-status';
            field.parentNode.appendChild(statusElement);
        }

        statusElement.textContent = message;
        statusElement.className = `field-status ${type}`;

        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                statusElement.textContent = '';
                statusElement.className = 'field-status';
            }, 3000);
        }
    }

    clearFieldStatus(field) {
        const statusElement = field.nextElementSibling;
        if (statusElement && statusElement.classList.contains('field-status')) {
            statusElement.textContent = '';
            statusElement.className = 'field-status';
        }
    }

    highlightActiveField(field) {
        // Remove highlight from all fields
        document.querySelectorAll('.form-field').forEach(f => {
            f.classList.remove('keyboard-focused');
        });

        // Add highlight to active field
        const fieldContainer = field.closest('.form-field');
        if (fieldContainer) {
            fieldContainer.classList.add('keyboard-focused');
        }
    }

    // ===== FORM SUBMISSION HANDLERS =====

    handleFormSuccess() {
        this.isSubmitting = false;
        this.setSubmitState('success');
        this.showStatus('Message sent successfully! I\'ll get back to you within 24 hours.', 'success');
        this.animateSuccess();
        
        // Reset form after success
        setTimeout(() => {
            this.form.reset();
            this.clearAllValidation();
            this.setSubmitState('default');
        }, 3000);
    }

    handleFormError(error) {
        this.isSubmitting = false;
        this.setSubmitState('error');
        this.showStatus(`Error: ${error.message || 'Please try again later.'}`, 'error');
        this.shakeForm();
    }

    // ===== UTILITY METHODS =====

    createAriaId(element) {
        const id = `aria-${Math.random().toString(36).substr(2, 9)}`;
        element.id = id;
        return id;
    }

    clearAllValidation() {
        document.querySelectorAll('.form-field').forEach(field => {
            field.classList.remove('valid', 'invalid');
        });

        document.querySelectorAll('.field-status').forEach(status => {
            status.textContent = '';
            status.className = 'field-status';
        });
    }

    animateSuccess() {
        // Create success animation
        const successOverlay = document.createElement('div');
        successOverlay.className = 'form-success-overlay';
        successOverlay.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check"></i>
            </div>
        `;

        this.formContainer.appendChild(successOverlay);

        // Remove after animation
        setTimeout(() => {
            if (successOverlay.parentNode) {
                successOverlay.parentNode.removeChild(successOverlay);
            }
        }, 2000);
    }

    // ===== PUBLIC METHODS =====

    resetForm() {
        this.form.reset();
        this.clearAllValidation();
        this.setSubmitState('default');
        this.showStatus('');
    }

    focusFirstField() {
        const firstField = this.form.querySelector('input, select, textarea');
        if (firstField) {
            firstField.focus();
        }
    }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ModernContactForm();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernContactForm;
}