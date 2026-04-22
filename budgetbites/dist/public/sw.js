// BudgetBites Service Worker for PWA functionality
const CACHE_NAME = 'budgetbites-v1.2.0';
const STATIC_CACHE = 'budgetbites-static-v1.2.0';
const DYNAMIC_CACHE = 'budgetbites-dynamic-v1.2.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/ar-pantry',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // TensorFlow.js and AI models (cached for offline AR scanning)
  'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js',
  'https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@latest/dist/mobilenet.min.js',
  // A-Frame for AR (cached for offline AR functionality)
  'https://aframe.io/releases/1.4.0/aframe.min.js',
  'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      console.log('Service Worker: Caching static files');
      await cache.addAll(STATIC_FILES);
    })()
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - serve cached files when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          // Clone response and cache successful API calls
          if (response.status === 200) {
            const responseClone = response.clone();
            const cache = await caches.open(DYNAMIC_CACHE);
            await cache.put(request, responseClone);
          }
          return response;
        } catch (error) {
          // Return cached API response if available
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return offline fallback for critical API endpoints
          if (url.pathname.includes('/meal-plans') || url.pathname.includes('/recipes')) {
            return new Response(
              JSON.stringify({
                offline: true,
                message: 'This content is not available offline. Please connect to the internet.',
                cached_data: []
              }),
              {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          }
          throw new Error('Network unavailable and no cache available');
        }
      })()
    );
    return;
  }
  
  // Handle static files with cache-first strategy
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      try {
        // Fetch from network and cache for future use
        const response = await fetch(request);
        
        // Only cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          
          // Determine which cache to use
          const cacheToUse = STATIC_FILES.includes(url.pathname) ? STATIC_CACHE : DYNAMIC_CACHE;
          
          const cache = await caches.open(cacheToUse);
          await cache.put(request, responseClone);
        }
        
        return response;
      } catch (error) {
        // Return offline fallback page for navigation requests
        if (request.destination === 'document') {
          const fallback = await caches.match('/');
          return fallback || new Response('Offline - Please check your connection', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        }
        
        throw new Error('Network request failed and no cache available');
      }
    })()
  );
});

// Background sync for meal plan data
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'meal-plan-sync') {
    event.waitUntil(
      (async () => {
        try {
          // Sync meal plan data when connection is restored
          await fetch('/api/sync-meal-plans', { method: 'POST' });
          console.log('Service Worker: Meal plans synced successfully');
        } catch (error) {
          console.error('Service Worker: Meal plan sync failed:', error);
        }
      })()
    );
  }
});

// Push notification handling (for future meal reminders)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Time to prep your meals!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'meal-reminder',
    actions: [
      {
        action: 'view-plan',
        title: 'View Meal Plan',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/icon-72x72.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('BudgetBites Reminder', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'view-plan') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Share target handling (for sharing recipes)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (url.pathname === '/share-target' && event.request.method === 'POST') {
    event.respondWith(
      (async () => {
        const formData = await event.request.formData();
        const title = formData.get('title') || '';
        const text = formData.get('text') || '';
        const url = formData.get('url') || '';
        
        // Redirect to main app with shared content
        const params = new URLSearchParams({ title, text, url });
        return Response.redirect(`/?shared=${params.toString()}`, 303);
      })()
    );
  }
});