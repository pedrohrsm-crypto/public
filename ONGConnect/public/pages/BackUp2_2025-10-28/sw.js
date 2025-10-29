/**
 * Service Worker for ONGConnect PWA
 * Provides offline functionality and caching
 */

const CACHE_NAME = 'ongconnect-pro-v1.0.0';
const STATIC_CACHE = 'ongconnect-static-v1.0.0';
const DYNAMIC_CACHE = 'ongconnect-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/styles/globals.css',
  '/src/styles/components/layout.css',
  '/src/styles/components/ui-components.css',
  '/src/app.js',
  '/src/components/Navigation.js',
  '/src/utils/accessibility.js',
  '/images/logo.png',
  '/images/hero-ongconnect.jpg',
  '/offline.html'
];

// Dynamic files to cache on request
const DYNAMIC_ASSETS = [
  '/images/',
  '/api/',
  '/src/'
];

// Network-first resources (always try network first)
const NETWORK_FIRST = [
  '/api/',
  '/auth/',
  '/user/'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Handle different types of requests
    if (isStaticAsset(url.pathname)) {
      return await cacheFirst(request);
    } else if (isNetworkFirst(url.pathname)) {
      return await networkFirst(request);
    } else if (isDynamicAsset(url.pathname)) {
      return await staleWhileRevalidate(request);
    } else {
      return await networkFirst(request);
    }
  } catch (error) {
    console.error('Service Worker: Fetch failed:', error);
    return await handleOffline(request);
  }
}

// Cache-first strategy (for static assets)
async function cacheFirst(request) {
  const cached = await caches.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    return await handleOffline(request);
  }
}

// Network-first strategy (for API calls)
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    
    if (cached) {
      return cached;
    }
    
    return await handleOffline(request);
  }
}

// Stale-while-revalidate strategy (for dynamic content)
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        const cache = caches.open(DYNAMIC_CACHE);
        cache.then((c) => c.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => cached);
  
  return cached || fetchPromise;
}

// Handle offline scenarios
async function handleOffline(request) {
  const url = new URL(request.url);
  
  // Try to find a cached version
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  
  // For HTML pages, return offline page
  if (request.headers.get('accept')?.includes('text/html')) {
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }
  }
  
  // For images, return a placeholder
  if (request.headers.get('accept')?.includes('image/')) {
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#9ca3af">Image unavailable</text></svg>',
      {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
  
  // Return a generic offline response
  return new Response('Content unavailable offline', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}

// Helper functions
function isStaticAsset(pathname) {
  return STATIC_ASSETS.some(asset => pathname.includes(asset)) ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.js') ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.jpg') ||
         pathname.endsWith('.jpeg') ||
         pathname.endsWith('.svg') ||
         pathname.endsWith('.ico') ||
         pathname.endsWith('.woff2') ||
         pathname.endsWith('.woff');
}

function isNetworkFirst(pathname) {
  return NETWORK_FIRST.some(path => pathname.startsWith(path));
}

function isDynamicAsset(pathname) {
  return DYNAMIC_ASSETS.some(path => pathname.startsWith(path));
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Retrieve pending requests from IndexedDB
    const pendingRequests = await getPendingRequests();
    
    for (const request of pendingRequests) {
      try {
        await fetch(request.url, request.options);
        await removePendingRequest(request.id);
        console.log('Background sync: Request completed:', request.url);
      } catch (error) {
        console.log('Background sync: Request failed:', request.url, error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'New notification from ONGConnect',
      icon: '/images/logo.png',
      badge: '/images/badge.png',
      tag: data.tag || 'default',
      requireInteraction: data.requireInteraction || false,
      actions: data.actions || [],
      data: data.data || {}
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'ONGConnect', options)
    );
  } catch (error) {
    console.error('Push notification error:', error);
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const action = event.action;
  const notification = event.notification;
  const data = notification.data || {};
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Try to focus existing window
      for (const client of clientList) {
        if (client.url === data.url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(data.url || '/');
      }
    })
  );
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
      
    case 'CACHE_URLS':
      event.waitUntil(cacheUrls(data.urls));
      break;
      
    case 'CLEAR_CACHE':
      event.waitUntil(clearCache(data.cacheName));
      break;
      
    default:
      console.log('Unknown message type:', type);
  }
});

async function cacheUrls(urls) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.addAll(urls);
    console.log('Service Worker: URLs cached:', urls);
  } catch (error) {
    console.error('Service Worker: Failed to cache URLs:', error);
  }
}

async function clearCache(cacheName = DYNAMIC_CACHE) {
  try {
    await caches.delete(cacheName);
    console.log('Service Worker: Cache cleared:', cacheName);
  } catch (error) {
    console.error('Service Worker: Failed to clear cache:', error);
  }
}

// IndexedDB helpers for background sync
async function getPendingRequests() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ongconnect-sync', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pending-requests'], 'readonly');
      const store = transaction.objectStore('pending-requests');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('pending-requests')) {
        db.createObjectStore('pending-requests', { keyPath: 'id' });
      }
    };
  });
}

async function removePendingRequest(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ongconnect-sync', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pending-requests'], 'readwrite');
      const store = transaction.objectStore('pending-requests');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Log service worker lifecycle
console.log('Service Worker: Script loaded');

// Handle unhandled promise rejections
self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker: Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// Handle errors
self.addEventListener('error', (event) => {
  console.error('Service Worker: Error:', event.error);
});
