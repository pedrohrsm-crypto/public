/**
 * Navigation Component
 * Handles mobile menu toggle and scroll behaviors
 * WCAG 2.1 AA Compliant
 */

class Navigation {
  constructor() {
    this.nav = document.querySelector('.navbar');
    this.toggle = document.querySelector('.nav-toggle');
    this.menu = document.querySelector('.nav-menu');
    this.links = document.querySelectorAll('.nav-link');
    this.body = document.body;
    this.isMenuOpen = false;
    this.lastScrollY = window.scrollY;
    
    this.init();
  }

  init() {
    if (!this.toggle || !this.menu) return;

    this.bindEvents();
    this.handleInitialState();
    this.setActiveLink();
  }

  bindEvents() {
    // Mobile menu toggle
    this.toggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMenu();
    });

    // Close menu when clicking links
    this.links.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isMenuOpen) {
          this.closeMenu();
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.nav.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMenu();
        this.toggle.focus();
      }
    });

    // Scroll behavior
    window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 100));

    // Handle resize
    window.addEventListener('resize', this.throttle(() => {
      if (window.innerWidth > 768 && this.isMenuOpen) {
        this.closeMenu();
      }
    }, 250));
  }

  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.isMenuOpen = true;
    this.toggle.classList.add('active');
    this.menu.classList.add('active');
    this.toggle.setAttribute('aria-expanded', 'true');
    this.menu.setAttribute('aria-hidden', 'false');
    
    // Prevent body scroll
    this.body.style.overflow = 'hidden';
    
    // Focus first menu item
    const firstLink = this.menu.querySelector('.nav-link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }

    // Announce to screen readers
    this.announceToScreenReader('Menu opened');
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.toggle.classList.remove('active');
    this.menu.classList.remove('active');
    this.toggle.setAttribute('aria-expanded', 'false');
    this.menu.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    this.body.style.overflow = '';

    // Announce to screen readers
    this.announceToScreenReader('Menu closed');
  }

  handleInitialState() {
    // Set initial ARIA attributes
    this.toggle.setAttribute('aria-expanded', 'false');
    this.toggle.setAttribute('aria-controls', 'nav-menu');
    this.menu.setAttribute('id', 'nav-menu');
    this.menu.setAttribute('aria-hidden', 'true');
    this.menu.setAttribute('aria-labelledby', 'nav-toggle');
    this.toggle.setAttribute('id', 'nav-toggle');
  }

  setActiveLink() {
    const currentPath = window.location.pathname;
    
    this.links.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      
      const href = link.getAttribute('href');
      if (href && (currentPath === href || currentPath.endsWith(href))) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Add scroll class for styling
    if (currentScrollY > 50) {
      this.nav.classList.add('scrolled');
    } else {
      this.nav.classList.remove('scrolled');
    }

    this.lastScrollY = currentScrollY;
  }

  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'visually-hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Public methods
  destroy() {
    // Remove event listeners and clean up
    if (this.isMenuOpen) {
      this.closeMenu();
    }
    
    this.toggle?.removeEventListener('click', this.toggleMenu);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleEscape);
  }
}

export default Navigation;