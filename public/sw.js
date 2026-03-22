/**
 * DriveMaster Service Worker (Simplified)
 *
 * Handles:
 * - PWA install lifecycle
 * - Offline fallback page
 * - Cache cleanup on version bump
 *
 * Vercel Edge Network handles asset caching in production.
 */

const CACHE_NAME = "drivemaster-v2";
const OFFLINE_URL = "/offline";

// Install: cache the offline fallback page
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first, offline fallback for navigation requests
self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(OFFLINE_URL))
  );
});

// Allow client to trigger skipWaiting
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});
