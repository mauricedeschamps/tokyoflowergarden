const CACHE_NAME = 'flower-trip-v1';
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json'
  // アイコンファイルや追加アセットがあればここに追加
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => new Response('Offline: you need internet connection', { status: 503 }))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});