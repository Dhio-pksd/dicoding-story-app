// Service Worker (Optional - for PWA features)
const CACHE_NAME = "dicoding-story-v1"
const urlsToCache = [
  "/",
  "/index.html",
  "/styles/main.css",
  "/js/app.js",
  "/js/config.js",
  "/js/models/StoryModel.js",
  "/js/models/AuthModel.js",
  "/js/views/HomeView.js",
  "/js/views/AddStoryView.js",
  "/js/views/LoginView.js",
  "/js/views/RegisterView.js",
  "/js/presenters/HomePresenter.js",
  "/js/presenters/AddStoryPresenter.js",
  "/js/presenters/AuthPresenter.js",
  "/js/utils/Router.js",
  "/js/utils/ViewTransition.js",
  "/js/utils/CameraUtils.js",
  "/js/utils/MapUtils.js",
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
