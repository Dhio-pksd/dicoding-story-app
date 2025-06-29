// Minimal app untuk testing
class App {
  constructor() {
    console.log("🏗️ Minimal App constructor")
  }

  async init() {
    console.log("🚀 Minimal App initializing...")

    // Show simple content
    const container = document.getElementById("app-container")
    if (container) {
      container.innerHTML = `
        <div style="padding: 2rem; text-align: center;">
          <h1>🎉 Dicoding Story App</h1>
          <p>App is working!</p>
          <p>Time: ${new Date().toLocaleString()}</p>
        </div>
      `
      console.log("✅ Content rendered")
    } else {
      console.error("❌ app-container not found")
    }

    console.log("✅ Minimal App initialized")
  }
}

export default App
