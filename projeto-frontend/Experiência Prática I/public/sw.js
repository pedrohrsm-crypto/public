/**
 * Service Worker for ONGConnect PWA
 * Provides offline functionality and caching
 * Enhanced with HTTPS security features
 */

const CACHE_NAME = 'ongconnect-secure-v1.0.0';
const STATIC_CACHE = 'ongconnect-static-secure-v1.0.0';
const DYNAMIC_CACHE = 'ongconnect-dynamic-secure-v1.0.0';

// Files to cache immediately - HTTPS only
const STATIC_ASSETS = [
  '/',
  '/pages/index.html',
  '/pages/sobre.html',
  '/pages/contato.html',
  '/pages/ONGs.html',
  '/pages/voluntario-portal.html',
  '/pages/doador-portal.html',
  '/pages/cadastro.html',
  '/pages/FAQ.html',
  '/manifest.json',
  '/styles/ong-color-palette.css',
  '/styles/ongs-custom.css',
  '/styles/inicio-custom.css',
  '/scripts/ongs-page.js',
  '/scripts/video-player.js',
  '/scripts/volunteer-portal.js'
];

// HTTPS Security Headers
const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Content-Security-Policy': "default-src 'self' https:; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https://images.unsplash.com https:; connect-src 'self' https:; frame-ancestors 'none';"
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker with HTTPS security...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets...');
      return cache.addAll(STATIC_ASSETS);
    }).catch((error) => {
      console.error('[SW] Error caching static assets:', error);
    })
  );
  
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// Fetch event - serve cached content with HTTPS security
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Only handle HTTPS requests
  if (!request.url.startsWith('https://') && !request.url.startsWith('http://localhost')) {
    return;
  }
  
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        // Add security headers to cached responses
        const newHeaders = new Headers(response.headers);
        Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
          newHeaders.set(key, value);
        });
        
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders
        });
      }
      
      // Fetch from network with HTTPS enforcement
      return fetch(request).then((fetchResponse) => {
        // Only cache HTTPS responses
        if (request.url.startsWith('https://') || request.url.startsWith('http://localhost')) {
          const responseClone = fetchResponse.clone();
          
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          
          // Add security headers to network responses
          const newHeaders = new Headers(fetchResponse.headers);
          Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
            newHeaders.set(key, value);
          });
          
          return new Response(fetchResponse.body, {
            status: fetchResponse.status,
            statusText: fetchResponse.statusText,
            headers: newHeaders
          });
        }
        
        return fetchResponse;
      }).catch((error) => {
        console.error('[SW] Fetch failed:', error);
        
        // Return offline page if available
        if (request.destination === 'document') {
          return caches.match('/pages/offline.html') || 
                 new Response('Você está offline. Verifique sua conexão com a internet.', {
                   status: 503,
                   statusText: 'Service Unavailable',
                   headers: new Headers({
                     'Content-Type': 'text/html; charset=utf-8',
                     ...SECURITY_HEADERS
                   })
                 });
        }
        
        throw error;
      });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'ong-submission') {
    event.waitUntil(syncONGSubmissions());
  }

  if (event.tag === 'volunteer-registration') {
    event.waitUntil(syncVolunteerRegistrations());
  }

  if (event.tag === 'volunteer-form-sync') {
    event.waitUntil(syncVolunteerFormSubmissions());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do ONGConnect',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'Ver detalhes',
        icon: '/assets/icons/view-action.png'
      },
      {
        action: 'dismiss',
        title: 'Dispensar',
        icon: '/assets/icons/dismiss-action.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('ONGConnect', options)
  );
});

// Helper functions
async function syncONGSubmissions() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    
    for (const request of requests) {
      if (request.url.includes('/api/ongs') && request.method === 'POST') {
        await fetch(request);
        await cache.delete(request);
      }
    }
  } catch (error) {
    console.error('[SW] Error syncing ONG submissions:', error);
  }
}

async function syncVolunteerRegistrations() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();

    for (const request of requests) {
      if (request.url.includes('/api/volunteers') && request.method === 'POST') {
        await fetch(request);
        await cache.delete(request);
      }
    }
  } catch (error) {
    console.error('[SW] Error syncing volunteer registrations:', error);
  }
}

async function syncVolunteerFormSubmissions() {
  console.log('[SW] Starting volunteer form sync...');
  
  try {
    // Open IndexedDB to get stored submissions
    const db = await openIndexedDB();
    const unsynced = await getUnsyncedSubmissions(db);
    
    console.log(`[SW] Found ${unsynced.length} unsynced volunteer submissions`);
    
    for (const submission of unsynced) {
      try {
        // Convert stored data back to FormData
        const formData = new FormData();
        Object.entries(submission.formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        });
        
        // Attempt to submit
        const response = await fetch('/api/volunteer-register', {
          method: 'POST',
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Sync-Retry': 'true'
          }
        });
        
        if (response.ok) {
          // Mark as synced
          await markAsSynced(db, submission.id);
          console.log(`[SW] Successfully synced submission ${submission.id}`);
        } else {
          // Increment retry count
          await incrementRetryCount(db, submission.id);
          console.warn(`[SW] Failed to sync submission ${submission.id}, status: ${response.status}`);
        }
      } catch (error) {
        await incrementRetryCount(db, submission.id);
        console.error(`[SW] Error syncing submission ${submission.id}:`, error);
      }
    }
  } catch (error) {
    console.error('[SW] Error in volunteer form sync process:', error);
  }
}

// IndexedDB helper functions for background sync
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ONGConnectOffline', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('volunteerSubmissions')) {
        const store = db.createObjectStore('volunteerSubmissions', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('synced', 'synced', { unique: false });
      }
    };
  });
}

function getUnsyncedSubmissions(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['volunteerSubmissions'], 'readonly');
    const store = transaction.objectStore('volunteerSubmissions');
    const index = store.index('synced');
    const request = index.getAll(false); // Get all unsynced (synced = false)
    
    request.onsuccess = () => {
      // Filter out submissions with too many retry attempts (>5)
      const submissions = request.result.filter(s => (s.retryCount || 0) < 5);
      resolve(submissions);
    };
    request.onerror = () => reject(request.error);
  });
}

function markAsSynced(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['volunteerSubmissions'], 'readwrite');
    const store = transaction.objectStore('volunteerSubmissions');
    const request = store.get(id);
    
    request.onsuccess = () => {
      const data = request.result;
      if (data) {
        data.synced = true;
        data.syncedAt = Date.now();
        const updateRequest = store.put(data);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        resolve(); // Record doesn't exist anymore
      }
    };
    request.onerror = () => reject(request.error);
  });
}

function incrementRetryCount(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['volunteerSubmissions'], 'readwrite');
    const store = transaction.objectStore('volunteerSubmissions');
    const request = store.get(id);
    
    request.onsuccess = () => {
      const data = request.result;
      if (data) {
        data.retryCount = (data.retryCount || 0) + 1;
        data.lastRetry = Date.now();
        const updateRequest = store.put(data);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        resolve(); // Record doesn't exist anymore
      }
    };
    request.onerror = () => reject(request.error);
  });
}console.log('[SW] ONGConnect Secure Service Worker loaded');

