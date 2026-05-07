const CACHE_NAME = 'pig-grandma-v1';
// 定義需要快取的靜態資源
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap'
];

// 安裝階段：將資源寫入快取
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('正在預存靜態資源');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 激活階段：清理舊版本快取
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
});

// 攔截請求：優先從快取抓取，沒網時也能開啟介面
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});