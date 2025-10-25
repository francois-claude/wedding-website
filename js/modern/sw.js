/**
 * Service Worker for Wedding Website
 * 
 * Provides offline functionality and caching strategies
 * for improved performance and user experience.
 */

const CACHE_NAME = 'wedding-website-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/css/styles.min.css',
    '/js/modern-scripts.js',
    '/img/logo.png',
    '/img/hero-placeholder.jpg',
    '/manifest.json'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => cache.addAll(STATIC_FILES))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
                        .map(name => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Handle different types of requests
    if (request.url.includes('/api/')) {
        // API requests - network first, cache fallback
        event.respondWith(networkFirst(request));
    } else if (request.destination === 'image') {
        // Images - cache first, network fallback
        event.respondWith(cacheFirst(request));
    } else {
        // Other requests - stale while revalidate
        event.respondWith(staleWhileRevalidate(request));
    }
});

/**
 * Network first strategy - for API calls
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        return cachedResponse || new Response('Offline', { status: 503 });
    }
}

/**
 * Cache first strategy - for images and static assets
 */
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        // Return placeholder image for failed image requests
        if (request.destination === 'image') {
            return caches.match('/img/placeholder.jpg');
        }
        throw error;
    }
}

/**
 * Stale while revalidate - for HTML and CSS
 */
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
    });
    
    return cachedResponse || fetchPromise;
}

// Background sync for RSVP submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'rsvp-sync') {
        event.waitUntil(syncRSVP());
    }
});

async function syncRSVP() {
    // Handle offline RSVP submissions
    const rsvpData = await getStoredRSVP();
    if (rsvpData) {
        try {
            await fetch('/api/rsvp', {
                method: 'POST',
                body: JSON.stringify(rsvpData),
                headers: { 'Content-Type': 'application/json' }
            });
            await clearStoredRSVP();
        } catch (error) {
            console.log('RSVP sync failed:', error);
        }
    }
}

// Push notifications for wedding updates
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Wedding update available!',
        icon: '/img/logo.png',
        badge: '/img/badge.png',
        vibrate: [200, 100, 200],
        actions: [
            { action: 'view', title: 'View Details' },
            { action: 'dismiss', title: 'Dismiss' }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Wedding Update', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});
