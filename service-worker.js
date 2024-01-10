const cacheName = "cacheAssets";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        cache.addAll([
          "/",
          "/index.html",
          "/js/app.js",
          "/js/scripts.js",
          "/js/database/app-db.js",
          "/css/styles.css",
          "/images/logo-512x512.png",
          "/images/logo.png",
          "/manifest.json",
        ]);
      })
      .catch((error) => {
        console.log("Cache failed:", error);
      })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((item) => item !== cacheName)
          .map((item) => caches.delete(item))
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
      .catch((error) => {
        console.log("Match failed:", error);
      })
  );
});
