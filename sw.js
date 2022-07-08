const cacheName = "nasPrviPWA-v1";

const OFFLINE_URL = "/PWAfrontend2022/offline.html";

self.addEventListener("install", (e) => {
  console.log("[Service Worker] Install");
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      console.log("[Service Worker] Caching all: app shell and content");
      await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
    })()
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      try {
        const cache = await caches.open(cacheName);
        //ako se traži podatak o vremenu, probaj dohvatiti s interneta
        if (e.request.url.includes("https://api.weatherapi.com/v1/")) {
          //probaj ici na internet dohvatiti to
          const response = await fetch(e.request);

          console.log(
            `[Service Worker] Caching new resource: ${e.request.url}`
          );
          let vraceno = response.clone();
          const newHeaders = new Headers(vraceno.headers);
          newHeaders.set("cache", "true");
          const newResponse = new Response(vraceno.body, {
            headers: newHeaders,
          });
          cache.put(e.request, newResponse);
          return response;
        } else {
          //serviraj chacheani podatak ako postoji
          const r = await caches.match(e.request);
          if (r) {
            return r;
          }

          //probaj ici na internet dohvatiti to
          const response = await fetch(e.request);
          cache.put(e.request, response.clone());
          return response;
        }
      } catch (error) {
        console.log("Fetch failed; returning offline page instead.", error);

        console.log(e.request);
        const r = await caches.match(e.request);
        console.log(
          `[Service Worker] Fetching resource from chache: ${e.request.url}`
        );
        console.log(r);
        if (r) return r;
      }
    })()
  );
});
