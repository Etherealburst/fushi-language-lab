const CACHE_NAME = "fushi-japonais-v1";
const CACHE_PREFIXES = ["fushi-japonais-", "fushi-language-lab-"];
const ASSET_URL = path => new URL(path, self.registration.scope).toString();
const REQUIRED_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./favicon.png"
].map(ASSET_URL);
const APP_SHELL = ASSET_URL("./index.html");

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(REQUIRED_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key !== CACHE_NAME && CACHE_PREFIXES.some(prefix => key.startsWith(prefix)))
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function cacheResponse(request, response) {
  const requestURL = typeof request === "string" ? request : request.url;
  if (!response.ok || new URL(requestURL).origin !== self.location.origin) return response;
  const copy = response.clone();
  caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => undefined);
  return response;
}

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => cacheResponse(APP_SHELL, response))
        .catch(() => caches.match(APP_SHELL))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => cacheResponse(event.request, response)))
  );
});
