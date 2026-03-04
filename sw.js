// Cambia este número para forzar actualización en todos los clientes
const CACHE_VERSION = 'v2';
const CACHE_NAME = 'scrollforce-' + CACHE_VERSION;

const APP_SHELL = [
    './',
    './index.html',
    './core/',
    './core/index.html',
    './config.html',
    './fenix.html',
    './manifest.json',
    './auth.js',
    './icon-192.png',
    './icon-512.png',
];

// Instalar: cachear app shell y activar inmediatamente sin esperar
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(APP_SHELL);
        }).then(function() {
            return self.skipWaiting(); // Activar sin esperar a que cierren las pestañas
        })
    );
});

// Activar: eliminar caches viejos y tomar control de todos los clientes
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys
                    .filter(function(key) { return key !== CACHE_NAME; })
                    .map(function(key) { return caches.delete(key); })
            );
        }).then(function() {
            return self.clients.claim(); // Tomar control de páginas ya abiertas
        }).then(function() {
            // Avisar a todos los clientes que hay nueva versión: recargar
            return self.clients.matchAll({ type: 'window' }).then(function(clients) {
                clients.forEach(function(client) {
                    client.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION });
                });
            });
        })
    );
});

// Fetch: network-first para HTML/JS (siempre código fresco), cache-first para imágenes
self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);

    // Solo manejar requests del mismo origen
    if (url.origin !== self.location.origin) return;

    const isImage = url.pathname.startsWith('/images/');

    if (isImage) {
        // Cache-first para imágenes estáticas
        event.respondWith(
            caches.match(event.request).then(function(cached) {
                return cached || fetch(event.request).then(function(response) {
                    return caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            })
        );
    } else {
        // Network-first para app shell (HTML, JS, etc.)
        event.respondWith(
            fetch(event.request).then(function(response) {
                return caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            }).catch(function() {
                return caches.match(event.request);
            })
        );
    }
});
