/**
 * Lazy Loading Implementation
 * WCAG 2.1 AA Compliant with accessibility considerations
 */

class LazyLoader {
    constructor() {
        this.imageObserver = null;
        this.componentObserver = null;
        this.init();
    }

    init() {
        // Check for Intersection Observer support
        if ('IntersectionObserver' in window) {
            this.setupImageLazyLoading();
            this.setupComponentLazyLoading();
        } else {
            // Fallback for older browsers
            this.loadAllImagesImmediately();
        }
    }

    setupImageLazyLoading() {
        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    this.imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px', // Start loading 50px before entering viewport
            threshold: 0.01
        });

        // Observe all lazy images
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    loadImage(img) {
        // Create new image element to preload
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            // Update src and remove data-src
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            
            // Announce to screen readers (accessibility)
            img.setAttribute('aria-label', `Imagem carregada: ${img.alt || 'Sem descrição'}`);
            
            // Dispatch custom event
            img.dispatchEvent(new CustomEvent('imageLoaded', {
                detail: { src: img.src }
            }));
        };

        imageLoader.onerror = () => {
            // Handle loading error
            img.classList.add('error');
            img.setAttribute('aria-label', 'Erro ao carregar imagem');
            console.warn('Falha ao carregar imagem:', img.dataset.src);
        };

        // Start loading
        imageLoader.src = img.dataset.src;
    }

    setupComponentLazyLoading() {
        this.componentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const component = entry.target;
                    this.loadComponent(component);
                    this.componentObserver.unobserve(component);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.1
        });

        // Observe all lazy components
        document.querySelectorAll('[data-component]').forEach(component => {
            this.componentObserver.observe(component);
        });
    }

    async loadComponent(element) {
        const componentName = element.dataset.component;
        
        try {
            // Dynamic import for code splitting
            const module = await import(`../components/${componentName}.js`);
            
            if (module.default) {
                const ComponentClass = module.default;
                new ComponentClass(element);
                element.classList.add('component-loaded');
            }
        } catch (error) {
            console.error(`Erro ao carregar componente ${componentName}:`, error);
            element.classList.add('component-error');
        }
    }

    loadAllImagesImmediately() {
        // Fallback for browsers without Intersection Observer
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }

    // Public methods for manual control
    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.loadImage(img);
        });
    }

    destroy() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
        if (this.componentObserver) {
            this.componentObserver.disconnect();
        }
    }
}

// Utility function to convert images to lazy loading format
function convertToLazyLoading() {
    document.querySelectorAll('img:not([data-src])').forEach(img => {
        if (img.src && !img.classList.contains('no-lazy')) {
            img.dataset.src = img.src;
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3C/svg%3E';
            img.classList.add('lazy-image');
        }
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Convert existing images to lazy loading format
    convertToLazyLoading();
    
    // Initialize lazy loader
    window.lazyLoader = new LazyLoader();
});

export default LazyLoader;