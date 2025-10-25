/**
 * Performance Monitoring and Analytics
 * 
 * Comprehensive performance tracking and user analytics
 * with privacy-first approach and GDPR compliance.
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        this.measureCoreWebVitals();
        this.trackUserInteractions();
        this.monitorErrors();
        this.setupPerformanceObserver();
    }

    /**
     * Measure Core Web Vitals
     */
    measureCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.startTime;
            this.reportMetric('LCP', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const firstInput = entryList.getEntries()[0];
            if (firstInput) {
                this.metrics.fid = firstInput.processingStart - firstInput.startTime;
                this.reportMetric('FID', this.metrics.fid);
            }
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            this.metrics.cls = clsValue;
            this.reportMetric('CLS', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });

        // Time to First Byte (TTFB)
        new PerformanceObserver((entryList) => {
            const [navigationEntry] = entryList.getEntries();
            this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
            this.reportMetric('TTFB', this.metrics.ttfb);
        }).observe({ entryTypes: ['navigation'] });
    }

    /**
     * Track user interactions
     */
    trackUserInteractions() {
        // Track scroll depth
        let maxScrollDepth = 0;
        const trackScrollDepth = () => {
            const scrollDepth = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                this.trackEvent('scroll_depth', { depth: scrollDepth });
            }
        };

        window.addEventListener('scroll', this.throttle(trackScrollDepth, 1000));

        // Track clicks on important elements
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-track]');
            if (target) {
                this.trackEvent('click', {
                    element: target.dataset.track,
                    text: target.textContent.trim().substring(0, 50)
                });
            }
        });

        // Track form interactions
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                this.trackEvent('form_submit', {
                    form: e.target.id || 'unnamed_form'
                });
            }
        });
    }

    /**
     * Monitor JavaScript errors
     */
    monitorErrors() {
        window.addEventListener('error', (e) => {
            this.trackError({
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                stack: e.error?.stack
            });
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.trackError({
                message: 'Unhandled Promise Rejection',
                reason: e.reason
            });
        });
    }

    /**
     * Setup Performance Observer for resource timing
     */
    setupPerformanceObserver() {
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (entry.initiatorType === 'img') {
                    this.trackImageLoad(entry);
                }
            }
        }).observe({ entryTypes: ['resource'] });
    }

    /**
     * Track image loading performance
     */
    trackImageLoad(entry) {
        const loadTime = entry.responseEnd - entry.startTime;
        this.reportMetric('image_load_time', loadTime, {
            url: entry.name,
            size: entry.transferSize
        });
    }

    /**
     * Report metric to analytics service
     */
    reportMetric(name, value, additionalData = {}) {
        // Only report in production and with user consent
        if (this.hasAnalyticsConsent() && window.location.hostname !== 'localhost') {
            const data = {
                metric: name,
                value: Math.round(value),
                timestamp: Date.now(),
                url: window.location.pathname,
                userAgent: navigator.userAgent,
                ...additionalData
            };

            // Send to analytics endpoint
            this.sendAnalytics('metrics', data);
        }
    }

    /**
     * Track custom events
     */
    trackEvent(eventName, properties = {}) {
        if (this.hasAnalyticsConsent()) {
            const data = {
                event: eventName,
                properties: {
                    ...properties,
                    timestamp: Date.now(),
                    url: window.location.pathname
                }
            };

            this.sendAnalytics('events', data);
        }
    }

    /**
     * Track errors
     */
    trackError(errorData) {
        const data = {
            error: errorData,
            timestamp: Date.now(),
            url: window.location.pathname,
            userAgent: navigator.userAgent
        };

        this.sendAnalytics('errors', data);
    }

    /**
     * Send data to analytics service
     */
    sendAnalytics(endpoint, data) {
        // Use sendBeacon for reliability
        if (navigator.sendBeacon) {
            navigator.sendBeacon(
                `/analytics/${endpoint}`,
                JSON.stringify(data)
            );
        } else {
            // Fallback to fetch
            fetch(`/analytics/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                keepalive: true
            }).catch(() => {
                // Silently fail - analytics shouldn't break the site
            });
        }
    }

    /**
     * Check if user has given analytics consent
     */
    hasAnalyticsConsent() {
        return localStorage.getItem('analytics_consent') === 'true';
    }

    /**
     * Throttle function for performance
     */
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
}

/**
 * Privacy-compliant Cookie Consent Manager
 */
class CookieConsent {
    constructor() {
        this.init();
    }

    init() {
        if (!this.hasConsent()) {
            this.showConsentBanner();
        }
    }

    hasConsent() {
        return localStorage.getItem('cookie_consent') === 'true';
    }

    showConsentBanner() {
        const banner = document.createElement('div');
        banner.className = 'cookie-consent';
        banner.innerHTML = `
            <div class="cookie-consent__content">
                <p>We use cookies to enhance your experience and analyze site usage. 
                   <a href="/privacy" target="_blank">Learn more</a></p>
                <div class="cookie-consent__buttons">
                    <button class="btn btn--secondary" data-action="reject">
                        Reject All
                    </button>
                    <button class="btn btn--primary" data-action="accept">
                        Accept All
                    </button>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .cookie-consent {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: white;
                border-top: 1px solid #e1e5e9;
                box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
                padding: 1rem;
                z-index: 1000;
                animation: slideUp 0.3s ease-out;
            }
            
            .cookie-consent__content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            
            .cookie-consent__buttons {
                display: flex;
                gap: 0.5rem;
            }
            
            @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
            }
            
            @media (max-width: 768px) {
                .cookie-consent__content {
                    flex-direction: column;
                    text-align: center;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(banner);

        // Handle button clicks
        banner.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action === 'accept') {
                this.acceptCookies();
            } else if (action === 'reject') {
                this.rejectCookies();
            }
            banner.remove();
        });
    }

    acceptCookies() {
        localStorage.setItem('cookie_consent', 'true');
        localStorage.setItem('analytics_consent', 'true');
        
        // Initialize analytics
        new PerformanceMonitor();
    }

    rejectCookies() {
        localStorage.setItem('cookie_consent', 'true');
        localStorage.setItem('analytics_consent', 'false');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CookieConsent();
        if (localStorage.getItem('analytics_consent') === 'true') {
            new PerformanceMonitor();
        }
    });
} else {
    new CookieConsent();
    if (localStorage.getItem('analytics_consent') === 'true') {
        new PerformanceMonitor();
    }
}
