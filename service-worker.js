const CACHE_NAME = "fushi-language-lab-v2";
const CACHE_PREFIX = "fushi-language-lab-";
const LEGACY_CACHE_NAMES = ["fushi-lab-v1"];
const ASSET_URL = path => new URL(path, self.registration.scope).toString();
const REQUIRED_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png"
].map(ASSET_URL);
const OPTIONAL_ASSETS = ["./icons/icon-180.png"].map(ASSET_URL);
const APP_SHELL = ASSET_URL("./index.html");

function cacheOptional(cache, asset) {
  return cache.add(asset).catch(() => undefined);
}

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(REQUIRED_ASSETS).then(() => Promise.all(
        OPTIONAL_ASSETS.map(asset => cacheOptional(cache, asset))
      )))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key !== CACHE_NAME && (
          key.startsWith(CACHE_PREFIX) || LEGACY_CACHE_NAMES.includes(key)
        ))
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          if (response.ok && new URL(event.request.url).origin === self.location.origin) {
            const copy = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, copy))
              .catch(() => undefined);
          }
          return response;
        })
        .catch(() => {
          if (event.request.mode === "navigate") return caches.match(APP_SHELL);
          return Response.error();
        });
    })
  );
});
