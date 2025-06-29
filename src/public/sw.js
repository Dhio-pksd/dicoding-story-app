// Service Worker (Optional - for PWA features)
const CACHE_NAME = "dicoding-story-v1"
const urlsToCache = [
  "/",
  "/index.html",
  "/bundle.js",
  // Add other static assets as needed
]

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request)
    }),
  )
})
