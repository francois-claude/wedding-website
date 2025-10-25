/**
 * Modern Wedding Website JavaScript (ES6+)
 * 
 * Enhanced version using modern JavaScript features:
 * - ES6+ syntax (const/let, arrow functions, template literals)
 * - Intersection Observer API for better performance
 * - CSS Custom Properties for dynamic theming
 * - Web Components for reusable UI elements
 * - Service Worker for offline functionality
 * 
 * @author Wedding Website Team
 * @version 3.0.0
 */

class WeddingWebsite {
    constructor() {
        this.config = {
            animations: {
                threshold: 0.1,
                rootMargin: '0px 0px -10% 0px'
            },
            scrolling: {
                behavior: 'smooth',
                block: 'start'
            }
        };
        
        this.init();
    }

    async init() {
        await this.loadDependencies();
        this.setupIntersectionObserver();
        this.initNavigation();
        this.initLazyLoading();
        this.initServiceWorker();
        this.setupThemeToggle();
    }

    /**
     * Modern Intersection Observer for animations
     * Replaces Waypoints for better performance
     */
    setupIntersectionObserver() {
        const animationElements = document.querySelectorAll('[data-animate]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animation = element.dataset.animate;
                    element.classList.add('animate__animated', `animate__${animation}`);
                    observer.unobserve(element);
                }
            });
        }, this.config.animations);

        animationElements.forEach(el => observer.observe(el));
    }

    /**
     * Enhanced navigation with modern event handling
     */
    initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const headerNav = document.querySelector('.header-nav');
        
        navToggle?.addEventListener('click', (e) => {
            e.preventDefault();
            navToggle.classList.toggle('active');
            headerNav.classList.toggle('open');
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                target?.scrollIntoView(this.config.scrolling);
            });
        });
    }

    /**
     * Modern lazy loading with Intersection Observer
     */
    initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    /**
     * Service Worker for offline functionality
     */
    async initServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered successfully');
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }

    /**
     * Dynamic theme switching
     */
    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Set initial theme
        this.setTheme(prefersDark.matches ? 'dark' : 'light');
        
        themeToggle?.addEventListener('click', () => {
            const currentTheme = document.documentElement.dataset.theme;
            this.setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
        
        // Listen for system theme changes
        prefersDark.addEventListener('change', (e) => {
            this.setTheme(e.matches ? 'dark' : 'light');
        });
    }

    setTheme(theme) {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('theme', theme);
    }

    /**
     * Load dependencies with modern async/await
     */
    async loadDependencies() {
        const dependencies = [
            'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
        ];

        const loadPromises = dependencies.map(url => {
            return new Promise((resolve, reject) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = url;
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            });
        });

        try {
            await Promise.all(loadPromises);
        } catch (error) {
            console.warn('Some dependencies failed to load:', error);
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new WeddingWebsite());
} else {
    new WeddingWebsite();
}

/**
 * Enhanced RSVP Form with modern fetch API
 */
class RSVPForm {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.init();
    }

    init() {
        this.form?.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            this.setLoading(true);
            
            const response = await fetch('/api/rsvp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                this.showSuccess();
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        const submitBtn = this.form.querySelector('[type="submit"]');
        submitBtn.disabled = loading;
        submitBtn.textContent = loading ? 'Sending...' : 'Send RSVP';
    }

    showSuccess() {
        this.showMessage('Thank you! Your RSVP has been received.', 'success');
    }

    showError(message) {
        this.showMessage(`Error: ${message}`, 'error');
    }

    showMessage(text, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `message message--${type}`;
        messageEl.textContent = text;
        this.form.appendChild(messageEl);
        
        setTimeout(() => messageEl.remove(), 5000);
    }
}

// Initialize RSVP form
new RSVPForm('#rsvp-form');
