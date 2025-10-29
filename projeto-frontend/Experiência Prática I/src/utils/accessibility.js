/**
 * Accessibility Utilities
 * Comprehensive WCAG 2.1 AA compliance helpers
 */

class AccessibilityUtils {
  constructor() {
    this.focusableElements = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');
    
    this.init();
  }

  init() {
    this.setupSkipLinks();
    this.setupFocusManagement();
    this.setupKeyboardNavigation();
    this.setupARIALiveRegions();
    this.setupReducedMotion();
    this.monitorFocusVisibility();
  }

  /**
   * Setup skip links functionality
   */
  setupSkipLinks() {
    const skipLinks = document.querySelectorAll('.skip-link');
    
    skipLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Announce skip action
          this.announceToScreenReader(`Skipped to ${target.getAttribute('aria-label') || targetId}`);
        }
      });
    });
  }

  /**
   * Enhanced focus management
   */
  setupFocusManagement() {
    // Focus trap for modals
    this.setupFocusTraps();
    
    // Focus restoration
    this.setupFocusRestoration();
    
    // Focus indicators
    this.enhanceFocusIndicators();
  }

  setupFocusTraps() {
    const modals = document.querySelectorAll('[role="dialog"], .modal');
    
    modals.forEach(modal => {
      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          this.trapFocus(e, modal);
        }
      });
    });
  }

  trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(this.focusableElements);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  setupFocusRestoration() {
    let lastFocusedElement = null;

    // Store focus before modal opens
    document.addEventListener('modal:open', (e) => {
      lastFocusedElement = document.activeElement;
    });

    // Restore focus when modal closes
    document.addEventListener('modal:close', (e) => {
      if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
      }
    });
  }

  enhanceFocusIndicators() {
    // Add custom focus indicators for better visibility
    document.addEventListener('focusin', (e) => {
      if (this.isKeyboardUser()) {
        e.target.classList.add('keyboard-focus');
      }
    });

    document.addEventListener('focusout', (e) => {
      e.target.classList.remove('keyboard-focus');
    });
  }

  /**
   * Keyboard navigation enhancements
   */
  setupKeyboardNavigation() {
    this.setupArrowKeyNavigation();
    this.setupEscapeKeyHandling();
    this.setupEnterSpaceHandling();
  }

  setupArrowKeyNavigation() {
    // Arrow key navigation for tab groups, menus, etc.
    const navigableGroups = document.querySelectorAll('[role="tablist"], [role="menubar"], .nav-menu');
    
    navigableGroups.forEach(group => {
      group.addEventListener('keydown', (e) => {
        const items = group.querySelectorAll('[role="tab"], [role="menuitem"], .nav-link');
        const currentIndex = Array.from(items).indexOf(document.activeElement);
        
        let newIndex;
        
        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault();
            newIndex = (currentIndex + 1) % items.length;
            items[newIndex].focus();
            break;
            
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
            items[newIndex].focus();
            break;
            
          case 'Home':
            e.preventDefault();
            items[0].focus();
            break;
            
          case 'End':
            e.preventDefault();
            items[items.length - 1].focus();
            break;
        }
      });
    });
  }

  setupEscapeKeyHandling() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close modals
        const openModal = document.querySelector('.modal-overlay.active');
        if (openModal) {
          this.closeModal(openModal);
          return;
        }
        
        // Close dropdowns
        const openDropdown = document.querySelector('.dropdown.active');
        if (openDropdown) {
          this.closeDropdown(openDropdown);
          return;
        }
        
        // Clear search
        const searchInput = document.querySelector('input[type="search"]:focus');
        if (searchInput && searchInput.value) {
          searchInput.value = '';
          searchInput.dispatchEvent(new Event('input'));
        }
      }
    });
  }

  setupEnterSpaceHandling() {
    // Make div/span clickable elements keyboard accessible
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && 
          e.target.matches('[role="button"], .clickable, .card-interactive')) {
        e.preventDefault();
        e.target.click();
      }
    });
  }

  /**
   * ARIA Live Region Management
   */
  setupARIALiveRegions() {
    // Create global live regions if they don't exist
    if (!document.querySelector('[aria-live="polite"]')) {
      this.createLiveRegion('polite');
    }
    
    if (!document.querySelector('[aria-live="assertive"]')) {
      this.createLiveRegion('assertive');
    }
  }

  createLiveRegion(politeness) {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', politeness);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'visually-hidden';
    liveRegion.id = `live-region-${politeness}`;
    document.body.appendChild(liveRegion);
    return liveRegion;
  }

  announceToScreenReader(message, politeness = 'polite') {
    const liveRegion = document.querySelector(`[aria-live="${politeness}"]`) || 
                      this.createLiveRegion(politeness);
    
    // Clear and set new message
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
    
    // Clear after announcement
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 3000);
  }

  /**
   * Reduced Motion Support
   */
  setupReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('reduce-motion');
      
      // Disable autoplay videos
      const videos = document.querySelectorAll('video[autoplay]');
      videos.forEach(video => {
        video.removeAttribute('autoplay');
        video.pause();
      });
      
      // Disable CSS animations
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Focus visibility monitoring
   */
  monitorFocusVisibility() {
    let hadKeyboardEvent = true;
    const keyboardEvents = ['keydown', 'keyup'];
    const mouseEvents = ['mousedown', 'mouseup'];

    keyboardEvents.forEach(event => {
      document.addEventListener(event, () => {
        hadKeyboardEvent = true;
      });
    });

    mouseEvents.forEach(event => {
      document.addEventListener(event, () => {
        hadKeyboardEvent = false;
      });
    });

    document.addEventListener('focusin', (e) => {
      if (hadKeyboardEvent) {
        document.body.classList.add('keyboard-user');
      } else {
        document.body.classList.remove('keyboard-user');
      }
    });
  }

  isKeyboardUser() {
    return document.body.classList.contains('keyboard-user');
  }

  /**
   * Modal Management
   */
  closeModal(modal) {
    modal.classList.remove('active');
    document.dispatchEvent(new CustomEvent('modal:close'));
    this.announceToScreenReader('Modal closed');
  }

  openModal(modal) {
    modal.classList.add('active');
    document.dispatchEvent(new CustomEvent('modal:open'));
    
    // Focus first focusable element
    const firstFocusable = modal.querySelector(this.focusableElements);
    if (firstFocusable) {
      firstFocusable.focus();
    }
    
    this.announceToScreenReader('Modal opened');
  }

  /**
   * Color Contrast Validation
   */
  validateColorContrast() {
    // Simple contrast checking (you might want to use a library for production)
    const elements = document.querySelectorAll('*');
    const issues = [];

    elements.forEach(element => {
      const styles = getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      if (color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        const contrast = this.calculateContrast(color, backgroundColor);
        const fontSize = parseFloat(styles.fontSize);
        const fontWeight = styles.fontWeight;
        
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || fontWeight >= 700));
        const requiredRatio = isLargeText ? 3 : 4.5;
        
        if (contrast < requiredRatio) {
          issues.push({
            element,
            contrast: contrast.toFixed(2),
            required: requiredRatio,
            isLargeText
          });
        }
      }
    });

    return issues;
  }

  calculateContrast(color1, color2) {
    // Simplified contrast calculation
    // In production, use a proper color contrast library
    const rgb1 = this.parseRGB(color1);
    const rgb2 = this.parseRGB(color2);
    
    const l1 = this.getLuminance(rgb1);
    const l2 = this.getLuminance(rgb2);
    
    const light = Math.max(l1, l2);
    const dark = Math.min(l1, l2);
    
    return (light + 0.05) / (dark + 0.05);
  }

  parseRGB(color) {
    // Very basic RGB parsing - enhance for production
    const match = color.match(/\d+/g);
    return match ? match.slice(0, 3).map(Number) : [0, 0, 0];
  }

  getLuminance([r, g, b]) {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * Text Scaling Support
   */
  setupTextScaling() {
    // Support for 200% text scaling
    const checkTextScale = () => {
      const testElement = document.createElement('div');
      testElement.style.cssText = 'width: 1rem; position: absolute; visibility: hidden;';
      document.body.appendChild(testElement);
      
      const remSize = testElement.offsetWidth;
      document.body.removeChild(testElement);
      
      if (remSize >= 32) { // 200% of 16px
        document.documentElement.classList.add('large-text');
      } else {
        document.documentElement.classList.remove('large-text');
      }
    };

    checkTextScale();
    window.addEventListener('resize', checkTextScale);
  }

  /**
   * Form Accessibility Enhancements
   */
  enhanceFormAccessibility() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Add required field indicators
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        const label = form.querySelector(`label[for="${field.id}"]`);
        if (label && !label.classList.contains('required')) {
          label.classList.add('required');
          field.setAttribute('aria-required', 'true');
        }
      });

      // Enhance error handling
      form.addEventListener('submit', (e) => {
        const errors = this.validateForm(form);
        if (errors.length > 0) {
          e.preventDefault();
          this.displayFormErrors(errors);
          this.announceToScreenReader(`Form has ${errors.length} error${errors.length > 1 ? 's' : ''}`, 'assertive');
        }
      });
    });
  }

  validateForm(form) {
    const errors = [];
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      if (input.hasAttribute('required') && !input.value.trim()) {
        errors.push({
          element: input,
          message: 'This field is required'
        });
      }
      
      if (input.type === 'email' && input.value && !this.isValidEmail(input.value)) {
        errors.push({
          element: input,
          message: 'Please enter a valid email address'
        });
      }
    });
    
    return errors;
  }

  displayFormErrors(errors) {
    // Clear previous errors
    document.querySelectorAll('.form-error').forEach(error => error.remove());
    
    errors.forEach(({ element, message }) => {
      element.classList.add('error');
      element.setAttribute('aria-invalid', 'true');
      
      const errorElement = document.createElement('div');
      errorElement.className = 'form-error';
      errorElement.textContent = message;
      errorElement.id = `${element.id}-error`;
      element.setAttribute('aria-describedby', errorElement.id);
      
      element.parentNode.appendChild(errorElement);
    });
    
    // Focus first error
    if (errors.length > 0) {
      errors[0].element.focus();
    }
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Public utility methods
   */
  
  // Initialize all accessibility features
  static init() {
    return new AccessibilityUtils();
  }
  
  // Quick accessibility audit
  auditPage() {
    const issues = [];
    
    // Check for missing alt text
    const images = document.querySelectorAll('img:not([alt])');
    if (images.length > 0) {
      issues.push(`${images.length} images missing alt text`);
    }
    
    // Check for missing form labels
    const inputs = document.querySelectorAll('input:not([type="submit"]):not([type="button"]):not([aria-label]):not([aria-labelledby])');
    const unlabeledInputs = Array.from(inputs).filter(input => {
      return !document.querySelector(`label[for="${input.id}"]`);
    });
    if (unlabeledInputs.length > 0) {
      issues.push(`${unlabeledInputs.length} form inputs missing labels`);
    }
    
    // Check color contrast
    const contrastIssues = this.validateColorContrast();
    if (contrastIssues.length > 0) {
      issues.push(`${contrastIssues.length} color contrast issues`);
    }
    
    return issues;
  }
}

export default AccessibilityUtils;