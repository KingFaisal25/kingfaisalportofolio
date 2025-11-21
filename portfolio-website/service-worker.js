const CACHE_NAME = 'portfolio-cache-v3';
const CORE_ASSETS = [
  './index.html',
  './styles/main-optimized.css',
  './scripts/main-simple.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => {
      if (key !== CACHE_NAME) return caches.delete(key);
    })))
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    if (req.destination === 'document' || req.mode === 'navigate') {
      event.respondWith(
        fetch(req).then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          return res;
        }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
      );
    } else if (req.destination === 'image' || req.destination === 'style' || req.destination === 'script') {
      event.respondWith(
        caches.match(req).then((cached) => {
          return cached || fetch(req).then((res) => {
            if (res.status === 200) {
              const clone = res.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
            }
            return res;
          });
        })
      );
    }
  }
});