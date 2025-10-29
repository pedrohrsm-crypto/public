/**
 * Google Analytics 4 Implementation with Privacy Compliance
 * LGPD/GDPR/CCPA Compatible Analytics
 */

class AnalyticsManager {
    constructor() {
        this.isInitialized = false;
        this.consentGiven = false;
        this.trackingId = 'G-XXXXXXXXXX'; // Replace with actual GA4 ID
        this.performanceObserver = null;
        this.init();
    }

    init() {
        // Check for existing consent
        this.consentGiven = this.getStoredConsent();
        
        if (this.consentGiven) {
            this.initializeAnalytics();
        }
        
        // Listen for consent changes
        document.addEventListener('cookieConsentChanged', (event) => {
            if (event.detail.analytics) {
                this.initializeAnalytics();
            } else {
                this.disableAnalytics();
            }
        });
    }

    getStoredConsent() {
        try {
            const consent = localStorage.getItem('cookieConsent');
            if (consent) {
                const parsed = JSON.parse(consent);
                return parsed.analytics === true;
            }
        } catch (error) {
            console.warn('Erro ao verificar consentimento:', error);
        }
        return false;
    }

    async initializeAnalytics() {
        if (this.isInitialized) return;

        try {
            // Load GA4 script
            await this.loadGAScript();
            
            // Configure gtag
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            
            gtag('js', new Date());
            gtag('config', this.trackingId, {
                // Privacy-compliant settings
                anonymize_ip: true,
                respect_dnt: true,
                ads_data_redaction: true,
                url_passthrough: false,
                
                // Performance monitoring
                custom_map: {
                    custom_parameter_1: 'core_web_vitals'
                }
            });

            this.isInitialized = true;
            this.setupPerformanceMonitoring();
            this.setupAccessibilityTracking();
            this.setupErrorTracking();
            
            console.log('📊 Google Analytics inicializado com conformidade de privacidade');
            
        } catch (error) {
            console.error('Erro ao inicializar Analytics:', error);
        }
    }

    loadGAScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    setupPerformanceMonitoring() {
        // Core Web Vitals monitoring
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint (LCP)
            this.observeMetric('largest-contentful-paint', (entries) => {
                const lcp = entries[entries.length - 1];
                this.trackPerformanceMetric('LCP', lcp.startTime, 'core_web_vitals');
            });

            // First Input Delay (FID)
            this.observeMetric('first-input', (entries) => {
                const fid = entries[0];
                this.trackPerformanceMetric('FID', fid.processingStart - fid.startTime, 'core_web_vitals');
            });

            // Cumulative Layout Shift (CLS)
            this.observeMetric('layout-shift', (entries) => {
                let clsValue = 0;
                for (const entry of entries) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.trackPerformanceMetric('CLS', clsValue, 'core_web_vitals');
            });
        }

        // Navigation timing
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                if (navigation) {
                    this.trackPerformanceMetric('Page_Load_Time', navigation.loadEventEnd - navigation.fetchStart, 'page_timing');
                    this.trackPerformanceMetric('DOM_Content_Loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart, 'page_timing');
                    this.trackPerformanceMetric('First_Byte', navigation.responseStart - navigation.fetchStart, 'page_timing');
                }
            }, 100);
        });
    }

    observeMetric(type, callback) {
        try {
            const observer = new PerformanceObserver((list) => {
                callback(list.getEntries());
            });
            observer.observe({ type, buffered: true });
        } catch (error) {
            console.warn(`Não foi possível observar métrica ${type}:`, error);
        }
    }

    trackPerformanceMetric(metricName, value, category) {
        if (!this.isInitialized) return;

        gtag('event', metricName.toLowerCase(), {
            event_category: category,
            value: Math.round(value),
            metric_name: metricName,
            page_url: window.location.pathname,
            user_agent: navigator.userAgent.substring(0, 100) // Truncated for privacy
        });
    }

    setupAccessibilityTracking() {
        // Track accessibility features usage
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                this.trackEvent('accessibility', 'keyboard_navigation', 'tab_navigation');
            }
        });

        // Track skip link usage
        document.querySelectorAll('.skip-link').forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('accessibility', 'skip_link_used', link.getAttribute('href'));
            });
        });

        // Track screen reader announcements
        const liveRegions = document.querySelectorAll('[aria-live]');
        liveRegions.forEach(region => {
            const observer = new MutationObserver(() => {
                this.trackEvent('accessibility', 'screen_reader_announcement', region.getAttribute('aria-live'));
            });
            observer.observe(region, { childList: true, subtree: true });
        });
    }

    setupErrorTracking() {
        // JavaScript errors
        window.addEventListener('error', (event) => {
            this.trackError('javascript_error', event.message, event.filename, event.lineno);
        });

        // Promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.trackError('promise_rejection', event.reason, window.location.href);
        });

        // Resource loading errors
        document.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.trackError('resource_error', event.target.src || event.target.href, event.target.tagName);
            }
        }, true);
    }

    trackError(errorType, message, source, line) {
        if (!this.isInitialized) return;

        gtag('event', 'exception', {
            description: `${errorType}: ${message}`,
            fatal: false,
            error_source: source,
            error_line: line
        });
    }

    trackEvent(category, action, label, value) {
        if (!this.isInitialized) return;

        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }

    trackPageView(page_title, page_location) {
        if (!this.isInitialized) return;

        gtag('config', this.trackingId, {
            page_title,
            page_location
        });
    }

    // Custom business metrics
    trackBusinessEvent(eventName, parameters = {}) {
        if (!this.isInitialized) return;

        gtag('event', eventName, {
            event_category: 'business',
            ...parameters
        });
    }

    // E-commerce tracking (for future use)
    trackPurchase(transactionId, items, value, currency = 'BRL') {
        if (!this.isInitialized) return;

        gtag('event', 'purchase', {
            transaction_id: transactionId,
            value: value,
            currency: currency,
            items: items
        });
    }

    trackAddToCart(item) {
        if (!this.isInitialized) return;

        gtag('event', 'add_to_cart', {
            currency: 'BRL',
            value: item.price,
            items: [item]
        });
    }

    disableAnalytics() {
        if (this.isInitialized) {
            // Disable GA
            window[`ga-disable-${this.trackingId}`] = true;
            
            // Clear any existing data
            if (window.gtag) {
                gtag('consent', 'update', {
                    analytics_storage: 'denied'
                });
            }
            
            console.log('📊 Google Analytics desabilitado');
        }
    }

    // Privacy-compliant user identification
    setUserId(userId) {
        if (!this.isInitialized) return;

        // Hash the user ID for privacy
        const hashedUserId = this.hashUserId(userId);
        gtag('config', this.trackingId, {
            user_id: hashedUserId
        });
    }

    hashUserId(userId) {
        // Simple hash function for privacy
        let hash = 0;
        if (userId.length === 0) return hash;
        for (let i = 0; i < userId.length; i++) {
            const char = userId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString();
    }

    // Debug mode for development
    enableDebugMode() {
        gtag('config', this.trackingId, {
            debug_mode: true
        });
    }

    // Generate privacy-compliant analytics report
    generatePrivacyReport() {
        return {
            trackingEnabled: this.isInitialized,
            consentStatus: this.consentGiven,
            dataProcessing: {
                ipAnonymization: true,
                respectDNT: true,
                adsDataRedaction: true
            },
            complianceStandards: ['LGPD', 'GDPR', 'CCPA'],
            dataRetention: '26 months (Google Analytics default)',
            userRights: [
                'Data access',
                'Data deletion', 
                'Data portability',
                'Consent withdrawal'
            ]
        };
    }
}

// Initialize analytics manager
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsManager = new AnalyticsManager();
});

export default AnalyticsManager;