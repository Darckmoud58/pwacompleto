/**
 * Referencia clásica de precache (clase).
 * En este proyecto el SW real lo genera vite-plugin-pwa (ver vite.config.ts),
 * porque Vite usa assets con hash (/assets/index-xxxx.js) y no /main.js ni /styles.css.
 *
 * Si se usara un SW manual, el precache típico sería:
 *
 * const CACHE_NAME = "todo-pwaa-cache-v1";
 * const urlsToCache = ["/", "/index.html", "/icons/web-app-manifest-192x192.png", ...];
 * self.addEventListener("install", ...)  -> caches.open + cache.addAll
 * self.addEventListener("activate", ...) -> borrar caches viejos
 */
const CACHE_NAME = "todo-pwaa-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/icons/web-app-manifest-192x192.png",
  "/icons/web-app-manifest-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        })
      )
    )
  );
  self.clients.claim();
});
