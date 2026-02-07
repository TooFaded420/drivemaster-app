/**
 * DriveMaster Service Worker
 * 
 * Features:
 * - Offline support with cache-first strategy
 * - Background sync for quiz progress
 * - Push notifications
 * - Periodic background sync for leaderboard updates
 */

const CACHE_NAME = "drivemaster-v1";
const STATIC_ASSETS = [
  "/",
  "/dashboard",
  "/quiz",
  "/leaderboard",
  "/profile",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - cache-first strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip API requests
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Skip Supabase requests
  if (url.hostname.includes("supabase")) {
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Return cached response and update cache in background
        fetch(request)
          .then((response) => {
            if (response.ok) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, response);
              });
            }
          })
          .catch(() => {
            // Network failed, but we have cached response
          });
        return cached;
      }

      // Not in cache, fetch from network
      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Network failed, try to return offline page
          if (request.mode === "navigate") {
            return caches.match("/offline");
          }
          return new Response("Network error", { status: 408 });
        });
    })
  );
});

// Background sync for quiz progress
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-quiz-progress") {
    event.waitUntil(syncQuizProgress());
  }
  if (event.tag === "sync-leaderboard") {
    event.waitUntil(syncLeaderboard());
  }
});

async function syncQuizProgress() {
  // Get pending quiz progress from IndexedDB
  // and sync with server
  const db = await openDB("drivemaster", 1);
  const pendingProgress = await db.getAll("pendingQuizProgress");

  for (const progress of pendingProgress) {
    try {
      await fetch("/api/quiz/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progress),
      });
      await db.delete("pendingQuizProgress", progress.id);
    } catch (error) {
      console.error("Failed to sync quiz progress:", error);
    }
  }
}

async function syncLeaderboard() {
  // Refresh leaderboard data in background
  try {
    const response = await fetch("/api/leaderboard");
    const data = await response.json();
    const cache = await caches.open(CACHE_NAME);
    await cache.put(
      "/api/leaderboard",
      new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
    );
  } catch (error) {
    console.error("Failed to sync leaderboard:", error);
  }
}

// Push notifications
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    tag: data.tag || "default",
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
    data: data.data || {},
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "DriveMaster", options)
  );
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const notificationData = event.notification.data;
  let url = "/dashboard";

  if (notificationData?.url) {
    url = notificationData.url;
  }

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      // Focus existing window if open
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      // Open new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});

// Periodic background sync (for leaderboard updates)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "leaderboard-update") {
    event.waitUntil(syncLeaderboard());
  }
});

// Message handler for client communication
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});

// Helper function to open IndexedDB
function openDB(name, version) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("pendingQuizProgress")) {
        db.createObjectStore("pendingQuizProgress", { keyPath: "id" });
      }
    };
  });
}
