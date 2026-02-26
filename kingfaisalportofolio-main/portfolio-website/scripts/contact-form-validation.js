/**
 * Modern Contact Form Validation and Interaction
 * Real-time validation with user-friendly feedback
 */

class ContactFormValidator {
    constructor(formSelector = '.contact-form-modern') {
        this.form = document.querySelector(formSelector);
        this.fields = {};
        this.isSubmitting = false;
        this.validationTimeout = null;
        
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.setupFields();
        this.setupEventListeners();
        this.setupProgressTracking();
        this.setupAccessibility();
        
        console.log('✅ Contact form validator initialized');
    }

    setupFields() {
        const fieldElements = this.form.querySelectorAll('[data-validate]');
        
        fieldElements.forEach(field => {
            const fieldName = field.name || field.id;
            this.fields[fieldName] = {
                element: field,
                type: field.dataset.validate || field.type,
                rules: this.parseValidationRules(field),
                isValid: false,
                wasTouched: false,
                feedbackElement: this.createFeedbackElement(field)
            };
        });
    }

    parseValidationRules(field) {
        const rules = {};
        const dataset = field.dataset;
        
        // Required validation
        if (field.hasAttribute('required') || dataset.required !== undefined) {
            rules.required = {
                message: dataset.requiredMessage || 'Field ini wajib diisi'
            };
        }
        
        // Min length validation
        if (dataset.minLength) {
            rules.minLength = {
                value: parseInt(dataset.minLength),
                message: dataset.minLengthMessage || `Minimal ${dataset.minLength} karakter`
            };
        }
        
        // Max length validation
        if (dataset.maxLength) {
            rules.maxLength = {
                value: parseInt(dataset.maxLength),
                message: dataset.maxLengthMessage || `Maksimal ${dataset.maxLength} karakter`
            };
        }
        
        // Pattern validation
        if (dataset.pattern) {
            rules.pattern = {
                value: new RegExp(dataset.pattern),
                message: dataset.patternMessage || 'Format tidak valid'
            };
        }
        
        // Email validation
        if (field.type === 'email' || dataset.validate === 'email') {
            rules.email = {
                message: dataset.emailMessage || 'Email tidak valid'
            };
        }
        
        // Phone validation
        if (field.type === 'tel' || dataset.validate === 'phone') {
            rules.phone = {
                message: dataset.phoneMessage || 'Nomor telepon tidak valid'
            };
        }
        
        // URL validation
        if (field.type === 'url' || dataset.validate === 'url') {
            rules.url = {
                message: dataset.urlMessage || 'URL tidak valid'
            };
        }
        
        // Number validation
        if (field.type === 'number' || dataset.validate === 'number') {
            rules.number = {
                message: dataset.numberMessage || 'Hanya angka yang diperbolehkan'
            };
            
            if (dataset.min) {
                rules.min = {
                    value: parseFloat(dataset.min),
                    message: dataset.minMessage || `Minimal ${dataset.min}`
                };
            }
            
            if (dataset.max) {
                rules.max = {
                    value: parseFloat(dataset.max),
                    message: dataset.maxMessage || `Maksimal ${dataset.max}`
                };
            }
        }
        
        // Custom validation function
        if (dataset.customValidate) {
            rules.custom = {
                function: dataset.customValidate,
                message: dataset.customMessage || 'Validasi gagal'
            };
        }
        
        return rules;
    }

    createFeedbackElement(field) {
        const feedback = document.createElement('div');
        feedback.className = 'form-feedback';
        feedback.setAttribute('role', 'alert');
        feedback.setAttribute('aria-live', 'polite');
        feedback.style.display = 'none';
        
        // Insert after the field or its parent
        const parent = field.closest('.form-group') || field.parentElement;
        parent.appendChild(feedback);
        
        return feedback;
    }

    setupEventListeners() {
        // Real-time validation on input
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            
            // Input event for real-time validation
            field.element.addEventListener('input', (e) => {
                this.debounceValidation(fieldName, e.target.value);
            });
            
            // Blur event for immediate validation
            field.element.addEventListener('blur', (e) => {
                field.wasTouched = true;
                this.validateField(fieldName, e.target.value);
            });
            
            // Focus event for visual feedback
            field.element.addEventListener('focus', (e) => {
                this.showFieldFocus(fieldName);
            });
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Prevent form submission on Enter for textarea
        this.form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName === 'TEXTAREA') {
                e.stopPropagation();
            }
        });
    }

    debounceValidation(fieldName, value) {
        clearTimeout(this.validationTimeout);
        
        this.validationTimeout = setTimeout(() => {
            this.validateField(fieldName, value);
        }, 300); // 300ms debounce
    }

    validateField(fieldName, value) {
        const field = this.fields[fieldName];
        if (!field) return;
        
        const errors = [];
        
        // Check each validation rule
        Object.keys(field.rules).forEach(ruleName => {
            const rule = field.rules[ruleName];
            const isValid = this.runValidationRule(ruleName, value, rule);
            
            if (!isValid) {
                errors.push(rule.message);
            }
        });
        
        // Update field state
        field.isValid = errors.length === 0;
        
        // Update UI
        this.updateFieldUI(fieldName, errors);
        
        // Update progress
        this.updateProgress();
        
        return field.isValid;
    }

    runValidationRule(ruleName, value, rule) {
        switch (ruleName) {
            case 'required':
                return value.trim().length > 0;
                
            case 'minLength':
                return value.length >= rule.value;
                
            case 'maxLength':
                return value.length <= rule.value;
                
            case 'pattern':
                return rule.value.test(value);
                
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                
            case 'phone':
                return /^[\+]?[0-9\s\-\(\)\.]{7,}$/.test(value);
                
            case 'url':
                try {
                    new URL(value);
                    return true;
                } catch {
                    return false;
                }
                
            case 'number':
                return !isNaN(value) && value.trim() !== '';
                
            case 'min':
                return parseFloat(value) >= rule.value;
                
            case 'max':
                return parseFloat(value) <= rule.value;
                
            case 'custom':
                try {
                    const customFunction = new Function('value', rule.function);
                    return customFunction(value);
                } catch (error) {
                    console.error('Custom validation error:', error);
                    return false;
                }
                
            default:
                return true;
        }
    }

    updateFieldUI(fieldName, errors) {
        const field = this.fields[fieldName];
        const element = field.element;
        const feedback = field.feedbackElement;
        
        // Remove existing states
        element.classList.remove('is-valid', 'is-invalid');
        
        if (errors.length === 0) {
            // Valid state
            element.classList.add('is-valid');
            feedback.style.display = 'none';
            feedback.innerHTML = '';
            
            // Add success animation
            this.animateFieldSuccess(element);
        } else {
            // Invalid state
            element.classList.add('is-invalid');
            feedback.style.display = 'block';
            feedback.innerHTML = errors[0]; // Show first error
            feedback.className = 'form-feedback invalid-feedback';
            
            // Add error animation
            this.animateFieldError(element);
        }
        
        // Announce to screen readers
        if (field.wasTouched) {
            this.announceToScreenReader(errors[0] || 'Valid');
        }
    }

    showFieldFocus(fieldName) {
        const field = this.fields[fieldName];
        if (!field) return;
        
        // Add focus visual feedback
        const element = field.element;
        element.style.transform = 'translateY(-2px)';
        
        // Remove transform after a short delay
        setTimeout(() => {
            if (document.activeElement === element) {
                element.style.transform = '';
            }
        }, 200);
    }

    animateFieldSuccess(element) {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'fieldSuccess 0.5s ease';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    animateFieldError(element) {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'fieldError 0.5s ease';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    setupProgressTracking() {
        const progressContainer = this.form.querySelector('.form-progress');
        if (!progressContainer) return;
        
        this.progressBar = progressContainer.querySelector('.progress-fill');
        this.progressText = progressContainer.querySelector('.progress-text');
        
        if (this.progressBar && this.progressText) {
            this.updateProgress();
        }
    }

    updateProgress() {
        if (!this.progressBar || !this.progressText) return;
        
        const totalFields = Object.keys(this.fields).length;
        const validFields = Object.values(this.fields).filter(field => field.isValid).length;
        const progress = (validFields / totalFields) * 100;
        
        this.progressBar.style.width = `${progress}%`;
        this.progressText.textContent = `${Math.round(progress)}% lengkap`;
        
        // Change color based on progress
        if (progress === 100) {
            this.progressBar.style.background = 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)';
            this.progressText.style.color = '#22c55e';
        } else if (progress >= 50) {
            this.progressBar.style.background = 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
            this.progressText.style.color = '#f59e0b';
        } else {
            this.progressBar.style.background = 'linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%)';
            this.progressText.style.color = 'var(--text-secondary)';
        }
    }

    setupAccessibility() {
        // Add ARIA attributes
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            const element = field.element;
            
            element.setAttribute('aria-invalid', 'false');
            element.setAttribute('aria-describedby', field.feedbackElement.id || `${fieldName}-feedback`);
            
            if (!field.feedbackElement.id) {
                field.feedbackElement.id = `${fieldName}-feedback`;
            }
        });
        
        // Add keyboard navigation
        this.form.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }

    handleTabNavigation(e) {
        const focusableElements = this.form.querySelectorAll(
            'input, textarea, select, button, [tabindex]:not([tabindex="-1"])'
        );
        
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        if (e.shiftKey && currentIndex === 0) {
            // Shift+Tab on first element - focus last element
            e.preventDefault();
            focusableElements[focusableElements.length - 1].focus();
        } else if (!e.shiftKey && currentIndex === focusableElements.length - 1) {
            // Tab on last element - focus first element
            e.preventDefault();
            focusableElements[0].focus();
        }
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    async handleSubmit() {
        if (this.isSubmitting) return;
        
        // Validate all fields
        let isFormValid = true;
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            field.wasTouched = true;
            
            const isValid = this.validateField(fieldName, field.element.value);
            if (!isValid) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            this.showFormError('Mohon perbaiki kesalahan pada form di bawah ini.');
            this.focusFirstError();
            return;
        }
        
        // Show loading state
        this.setSubmitting(true);
        
        try {
            // Simulate form submission
            await this.simulateFormSubmission();
            
            // Show success message
            this.showFormSuccess('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.');
            
            // Reset form
            this.resetForm();
            
        } catch (error) {
            this.showFormError('Gagal mengirim pesan. Silakan coba lagi.');
            console.error('Form submission error:', error);
        } finally {
            this.setSubmitting(false);
        }
    }

    async simulateFormSubmission() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    setSubmitting(isSubmitting) {
        this.isSubmitting = isSubmitting;
        const submitButton = this.form.querySelector('.btn-submit');
        
        if (submitButton) {
            submitButton.disabled = isSubmitting;
            
            if (isSubmitting) {
                submitButton.classList.add('loading');
                submitButton.innerHTML = '<span>Mengirim...</span>';
            } else {
                submitButton.classList.remove('loading');
                submitButton.innerHTML = '<span>Kirim Pesan</span>';
            }
        }
    }

    showFormSuccess(message) {
        const alert = this.createAlert('success', message);
        this.form.parentNode.insertBefore(alert, this.form);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    showFormError(message) {
        const alert = this.createAlert('error', message);
        this.form.parentNode.insertBefore(alert, this.form);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    createAlert(type, message) {
        const alert = document.createElement('div');
        alert.className = `form-alert form-alert-${type}`;
        alert.setAttribute('role', 'alert');
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button type="button" class="alert-close" aria-label="Tutup">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add close functionality
        const closeBtn = alert.querySelector('.alert-close');
        closeBtn.addEventListener('click', () => {
            alert.remove();
        });
        
        return alert;
    }

    focusFirstError() {
        const firstErrorField = Object.values(this.fields).find(field => !field.isValid);
        if (firstErrorField) {
            firstErrorField.element.focus();
            
            // Scroll to field
            firstErrorField.element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    resetForm() {
        this.form.reset();
        
        // Reset field states
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            field.isValid = false;
            field.wasTouched = false;
            
            // Reset UI
            field.element.classList.remove('is-valid', 'is-invalid');
            field.feedbackElement.style.display = 'none';
            field.feedbackElement.innerHTML = '';
        });
        
        // Reset progress
        this.updateProgress();
    }

    // Public API methods
    validate() {
        let isValid = true;
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            field.wasTouched = true;
            
            if (!this.validateField(fieldName, field.element.value)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        return data;
    }

    addCustomValidation(fieldName, validatorFunction, message = 'Validasi gagal') {
        const field = this.fields[fieldName];
        if (!field) return;
        
        field.rules.custom = {
            function: validatorFunction.toString(),
            message: message
        };
    }
}

// Add CSS animations for field validation
const validationStyles = `
    @keyframes fieldSuccess {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    @keyframes fieldError {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .form-alert {
        position: relative;
        padding: 1rem;
        margin-bottom: 1.5rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        animation: slideInUp 0.3s ease;
    }
    
    .form-alert-success {
        background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
        border: 1px solid #22c55e;
        color: #166534;
    }
    
    .form-alert-error {
        background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
        border: 1px solid #ef4444;
        color: #991b1b;
    }
    
    .alert-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .alert-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: background 0.2s ease;
    }
    
    .alert-close:hover {
        background: rgba(0, 0, 0, 0.1);
    }
    
    .form-feedback {
        margin-top: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .valid-feedback {
        color: #22c55e;
    }
    
    .invalid-feedback {
        color: #ef4444;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = validationStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.contactFormValidator = new ContactFormValidator();
});

// Export for use in other scripts
window.ContactFormValidator = ContactFormValidator;