/**
 * Application Initialization
 * Main entry point for the ONGConnect application
 * WCAG 2.1 AA Compliant
 */

import Navigation from './components/Navigation.js';
import AccessibilityUtils from './utils/accessibility.js';

class App {
  constructor() {
    this.navigation = null;
    this.accessibility = null;
    this.components = new Map();
    this.isInitialized = false;
    
    this.init();
  }

  async init() {
    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initializeApp());
      } else {
        this.initializeApp();
      }
    } catch (error) {
      console.error('Failed to initialize application:', error);
      this.handleInitializationError(error);
    }
  }

  initializeApp() {
    console.log('Initializing ONGConnect...');
    
    // Initialize core components
    this.initializeAccessibility();
    this.initializeNavigation();
    this.initializeUIComponents();
    this.initializeServiceWorker();
    this.setupEventListeners();
    this.setupPerformanceMonitoring();
    
    this.isInitialized = true;
    
    // Announce app is ready
    this.announceAppReady();
    
    console.log('ONGConnect initialized successfully');
  }

  /**
   * Initialize accessibility utilities
   */
  initializeAccessibility() {
    try {
      this.accessibility = new AccessibilityUtils();
      this.components.set('accessibility', this.accessibility);
      
      // Run initial accessibility audit in development
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          const issues = this.accessibility.auditPage();
          if (issues.length > 0) {
            console.warn('Accessibility issues found:', issues);
          } else {
            console.log('✅ No accessibility issues detected');
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to initialize accessibility:', error);
    }
  }

  /**
   * Initialize navigation component
   */
  initializeNavigation() {
    try {
      this.navigation = new Navigation();
      this.components.set('navigation', this.navigation);
    } catch (error) {
      console.error('Failed to initialize navigation:', error);
    }
  }

  /**
   * Initialize UI components
   */
  initializeUIComponents() {
    this.initializeCards();
    this.initializeForms();
    this.initializeModals();
    this.initializeTabs();
    this.initializeTooltips();
    this.initializeScrollEffects();
  }

  /**
   * Initialize interactive cards
   */
  initializeCards() {
    const interactiveCards = document.querySelectorAll('.card-interactive, .service-card');
    
    interactiveCards.forEach(card => {
      // Make cards keyboard accessible
      if (!card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
      }
      
      if (!card.hasAttribute('role')) {
        card.setAttribute('role', 'button');
      }

      // Add keyboard support
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });

      // Add hover effects with accessibility announcements
      card.addEventListener('mouseenter', () => {
        const title = card.querySelector('.card-title, .service-title')?.textContent;
        if (title) {
          card.setAttribute('aria-label', `${title} - Click to learn more`);
        }
      });
    });
  }

  /**
   * Initialize form enhancements
   */
  initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Enhanced form validation
      this.setupFormValidation(form);
      
      // Auto-save functionality
      this.setupAutoSave(form);
      
      // Character counting
      this.setupCharacterCounting(form);
    });
  }

  setupFormValidation(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // Real-time validation
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
      
      // Clear errors on input
      input.addEventListener('input', () => {
        this.clearFieldError(input);
      });
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmission(form);
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    
    // Email validation
    else if (field.type === 'email' && value && !this.isValidEmail(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
    
    // Phone validation
    else if (field.type === 'tel' && value && !this.isValidPhone(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid phone number';
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    } else {
      this.clearFieldError(field);
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    
    let errorElement = field.parentNode.querySelector('.form-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'form-error';
      errorElement.id = `${field.id}-error`;
      field.setAttribute('aria-describedby', errorElement.id);
      field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
  }

  clearFieldError(field) {
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
    
    const errorElement = field.parentNode.querySelector('.form-error');
    if (errorElement) {
      errorElement.remove();
      field.removeAttribute('aria-describedby');
    }
  }

  setupAutoSave(form) {
    if (!form.dataset.autosave) return;
    
    const inputs = form.querySelectorAll('input, textarea, select');
    const saveKey = `autosave_${form.id || 'form'}`;
    
    // Load saved data
    try {
      const savedData = JSON.parse(localStorage.getItem(saveKey) || '{}');
      inputs.forEach(input => {
        if (savedData[input.name]) {
          input.value = savedData[input.name];
        }
      });
    } catch (error) {
      console.warn('Failed to load auto-saved form data:', error);
    }
    
    // Save data on input
    const saveData = this.debounce(() => {
      const data = {};
      inputs.forEach(input => {
        if (input.name) {
          data[input.name] = input.value;
        }
      });
      localStorage.setItem(saveKey, JSON.stringify(data));
    }, 1000);
    
    inputs.forEach(input => {
      input.addEventListener('input', saveData);
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', () => {
      localStorage.removeItem(saveKey);
    });
  }

  setupCharacterCounting(form) {
    const textareas = form.querySelectorAll('textarea[maxlength]');
    
    textareas.forEach(textarea => {
      const maxLength = parseInt(textarea.getAttribute('maxlength'));
      const counter = document.createElement('div');
      counter.className = 'character-counter';
      counter.setAttribute('aria-live', 'polite');
      
      const updateCounter = () => {
        const remaining = maxLength - textarea.value.length;
        counter.textContent = `${remaining} characters remaining`;
        
        if (remaining < 20) {
          counter.classList.add('warning');
        } else {
          counter.classList.remove('warning');
        }
      };
      
      textarea.addEventListener('input', updateCounter);
      textarea.parentNode.appendChild(counter);
      updateCounter();
    });
  }

  handleFormSubmission(form) {
    // Validate all fields
    const inputs = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });
    
    if (!isFormValid) {
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.focus();
      }
      this.accessibility.announceToScreenReader('Form contains errors. Please review and correct.', 'assertive');
      return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.classList.add('button-loading');
      submitButton.disabled = true;
    }
    
    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
      this.showFormSuccess(form);
      if (submitButton) {
        submitButton.classList.remove('button-loading');
        submitButton.disabled = false;
      }
    }, 2000);
  }

  showFormSuccess(form) {
    // Create success message
    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success';
    successAlert.innerHTML = `
      <div class="alert-title">Success!</div>
      <div class="alert-description">Your message has been sent successfully. We'll get back to you soon.</div>
    `;
    
    form.parentNode.insertBefore(successAlert, form);
    form.reset();
    
    this.accessibility.announceToScreenReader('Form submitted successfully', 'polite');
    
    // Remove success message after 5 seconds
    setTimeout(() => {
      successAlert.remove();
    }, 5000);
  }

  /**
   * Initialize modal functionality
   */
  initializeModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modalCloses = document.querySelectorAll('.modal-close, .modal-overlay');
    
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
          this.openModal(modal);
        }
      });
    });
    
    modalCloses.forEach(close => {
      close.addEventListener('click', (e) => {
        if (e.target === close) {
          const modal = close.closest('.modal-overlay');
          if (modal) {
            this.closeModal(modal);
          }
        }
      });
    });
  }

  openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus first focusable element
    const firstFocusable = modal.querySelector('button, input, select, textarea, [tabindex="0"]');
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 100);
    }
    
    this.accessibility.announceToScreenReader('Modal opened');
  }

  closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    this.accessibility.announceToScreenReader('Modal closed');
  }

  /**
   * Initialize tabs functionality
   */
  initializeTabs() {
    const tabGroups = document.querySelectorAll('.tabs');
    
    tabGroups.forEach(tabGroup => {
      const tabButtons = tabGroup.querySelectorAll('.tab-button');
      const tabContents = tabGroup.querySelectorAll('.tab-content');
      
      tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
          this.switchTab(tabButtons, tabContents, index);
        });
        
        button.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const currentIndex = Array.from(tabButtons).indexOf(button);
            let newIndex;
            
            if (e.key === 'ArrowRight') {
              newIndex = (currentIndex + 1) % tabButtons.length;
            } else {
              newIndex = currentIndex === 0 ? tabButtons.length - 1 : currentIndex - 1;
            }
            
            tabButtons[newIndex].focus();
            this.switchTab(tabButtons, tabContents, newIndex);
          }
        });
      });
    });
  }

  switchTab(buttons, contents, activeIndex) {
    buttons.forEach((button, index) => {
      button.classList.toggle('active', index === activeIndex);
      button.setAttribute('aria-selected', index === activeIndex);
      button.setAttribute('tabindex', index === activeIndex ? '0' : '-1');
    });
    
    contents.forEach((content, index) => {
      content.classList.toggle('active', index === activeIndex);
      content.setAttribute('aria-hidden', index !== activeIndex);
    });
  }

  /**
   * Initialize tooltips
   */
  initializeTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
      const tooltipText = trigger.getAttribute('data-tooltip');
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = tooltipText;
      tooltip.setAttribute('role', 'tooltip');
      
      trigger.appendChild(tooltip);
      trigger.classList.add('tooltip-container');
      
      // ARIA setup
      const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
      tooltip.id = tooltipId;
      trigger.setAttribute('aria-describedby', tooltipId);
    });
  }

  /**
   * Initialize scroll effects
   */
  initializeScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.service-card, .stat-item, .contact-item');
    animatedElements.forEach(element => {
      observer.observe(element);
    });
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update URL without jumping
          history.replaceState(null, null, `#${targetId}`);
        }
      });
    });
  }

  /**
   * Initialize Service Worker for PWA
   */
  async initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    }
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Handle form submissions
    document.addEventListener('submit', (e) => {
      if (e.target.matches('form')) {
        this.handleFormSubmission(e.target);
      }
    });
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Alt + 1 to skip to main content
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        const main = document.querySelector('main, #main-content');
        if (main) {
          main.focus();
          main.scrollIntoView({ behavior: 'smooth' });
        }
      }
      
      // Alt + 2 to skip to navigation
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        const nav = document.querySelector('nav, .navbar');
        if (nav) {
          const firstLink = nav.querySelector('a, button');
          if (firstLink) {
            firstLink.focus();
          }
        }
      }
    });
    
    // Handle theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', this.handleThemeChange.bind(this));
    }
  }

  handleThemeChange(e) {
    // Handle automatic theme switching
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    // Web Vitals monitoring
    if ('web-vital' in window) {
      // Monitor Core Web Vitals
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      }).catch(() => {
        // Web Vitals not available
      });
    }
    
    // Basic performance monitoring
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    });
  }

  /**
   * Announce app readiness to screen readers
   */
  announceAppReady() {
    this.accessibility.announceToScreenReader('ONGConnect application loaded and ready to use');
  }

  /**
   * Handle initialization errors
   */
  handleInitializationError(error) {
    // Create error message for users
    const errorMessage = document.createElement('div');
    errorMessage.className = 'alert alert-error';
    errorMessage.innerHTML = `
      <div class="alert-title">Application Error</div>
      <div class="alert-description">
        There was a problem loading the application. Please refresh the page or contact support if the problem persists.
      </div>
    `;
    
    document.body.insertBefore(errorMessage, document.body.firstChild);
    
    // Announce error to screen readers
    if (this.accessibility) {
      this.accessibility.announceToScreenReader('Application failed to load properly', 'assertive');
    }
  }

  /**
   * Utility methods
   */
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPhone(phone) {
    return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ''));
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Public API
   */
  getComponent(name) {
    return this.components.get(name);
  }

  isReady() {
    return this.isInitialized;
  }

  destroy() {
    // Clean up all components
    this.components.forEach(component => {
      if (component.destroy) {
        component.destroy();
      }
    });
    
    this.components.clear();
    this.isInitialized = false;
  }
}

// Initialize the application
const app = new App();

// Make app globally available for debugging
window.ONGConnectApp = app;

export default App;
