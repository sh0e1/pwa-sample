const CACHE_NAME = 'pwa-sample-cache-v1'
const urlsToCache = [
  '/',
  'index.html'
]

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(res) {
      if (res) {
        return res;
      }

      const fetchRequest = event.request.clone()

      return fetch(fetchRequest).then(function(res) {
        if (!res || res.status !== 200 || res.type !== 'basic') {
          return res;
        }

        const responseToCache = res.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        return res;
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  const cacheWhitelist = ['pwa-sample-cache-v2']

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
