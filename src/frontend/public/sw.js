const VERSION = '2.0.0';
const CACHE_NAME = `sdaawn-pwa-${VERSION}`;

// Files to cache on install
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  // Common CSS/JS if any
];

// Install event — cache assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching core assets');
      return cache.addAll(CORE_ASSETS);
    }).then(() => {
      self.skipWaiting();
    })
  );
});

// Activate event — clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...', CACHE_NAME);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

// Fetch event — serve from cache first, then network
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external URLs
  if (url.origin !== self.location.origin) {
    return;
  }

  // For navigation requests, always go to network first (so we get latest HTML)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request).then((cached) => cached || caches.match('/'));
      })
    );
    return;
  }

  // For other requests (JS, CSS, images, etc.), use cache-first strategy
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }
      // If not in cache, fetch from network and cache it
      return fetch(request).then((response) => {
        // Don't cache cross-origin or non-success responses
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        // Clone the response for caching
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      });
    })
  );
});

// Periodic cache cleanup for old versions
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
