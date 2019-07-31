/* sw.js -- A serivce worker OwO. Used for maintaining the resources of the app if cached and offline. */

importScripts('/scripts/cache-polyfill.js'); // Import a polyfill.

var cacheName = 'pwac';

var filesToCache = [
    '/',
    'index.html',
    'sw.js',
    'manifest.json',

    'styles/styles.css',
];

// Checking if the service worker actually exists.
if ('serviceWorker' in navigator) {
    nagivator.serviceWorker.register('sw.js').then(function() {
        console.log('Service Worker says hewwo.');
    }).catch(function(err) {
        console.log('Service Worker says ono');
        console.log(err);
    });
}

// Activating the service worker.
self.addEventListener('activate', function (event) {
  console.log('Service Worker is happy.');
});

// Installing files to local cache.
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('Service Worker is stealing files.');
      return cache.addAll(filesToCache);
    })
  )
});

// Actually requesting and grabbing files.
self.addEventListener('fetch', function(event) {
  event.respondWith(
    // test if the request is cached
    caches.match(event.request).then(function(response) {
      // 1) if response cached, it will be returned from browser cache
      // 2) if response not cached, fetch resource from network
      return response || fetch(event.request);
    }).catch(function (err) {
      // if response not cached and network not available an error is thrown => return fallback image
      return caches.match('img/offline-img.png');
    })
  )
});
