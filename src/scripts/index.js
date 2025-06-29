// Minimal index untuk testing
import "../styles/main.css"
import App from "./app-minimal.js"

console.log("🚀 Minimal Dicoding Story App Starting...")

document.addEventListener("DOMContentLoaded", async () => {
  console.log("📱 DOM Loaded")
  try {
    const app = new App()
    await app.init()
    console.log("✅ Success!")
  } catch (error) {
    console.error("❌ Error:", error)
  }
})
