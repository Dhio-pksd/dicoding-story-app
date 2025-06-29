import "../styles/main.css"
import App from "./app.js"

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const app = new App()
  app.init()
})

// Service Worker registration (optional, for PWA features)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
