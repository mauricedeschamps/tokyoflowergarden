const CACHE_NAME = 'hana-meguri-v1';
const urlsToCache = [
  '/',
  '.index.html',
  '.manifest.json'
  // 必要に応じてアイコンファイルやフォントも追加可
];

// インストール時にキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// フェッチ時にキャッシュ優先（オフライン対応）
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュにあればそれを返す
        if (response) {
          return response;
        }
        // なければネットワークへ
        return fetch(event.request).then(
          networkResponse => {
            // 動的なリクエスト（APIなど）はキャッシュしない
            return networkResponse;
          }
        ).catch(() => {
          // 完全オフライン時には簡易オフラインページを返すことも可能
          return new Response('オフラインです。接続を確認してください。', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

// 古いキャッシュの削除
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});