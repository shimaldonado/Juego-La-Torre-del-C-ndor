const CACHE_NAME = 'torre-del-condor-v4';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Solo se cachean peticiones http/https del mismo sitio.
  // Esto evita el error: Request scheme 'chrome-extension' is unsupported.
  if (!['http:', 'https:'].includes(requestUrl.protocol) || requestUrl.origin !== self.location.origin) {
    return;
  }

  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((networkResponse) => {
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME)
          .then((cache) => cache.put(event.request, responseToCache))
          .catch(() => {});
        return networkResponse;
      });
    })
  );
});
