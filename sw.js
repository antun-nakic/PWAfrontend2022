const cacheName = "nasPrviPWA-v1";

self.addEventListener("install", (e) => {
  console.log("[Service Worker] Install");
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      console.log("[Service Worker] Caching all: app shell and content");
      await cache.addAll([{ a: 1 }, { b: 2 }]);
    })()
  );
});
