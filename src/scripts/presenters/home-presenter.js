import AuthModel from "../models/auth-model.js"
import L from "leaflet"
import CONFIG from "../globals/config.js"

class HomePresenter {
  constructor(model, view, dbHelper) {
    this.model = model
    this.view = view
    this.dbHelper = dbHelper
    this.initializeEventListeners()
  }

  async init() {
    console.log("🏠 HomePresenter initializing...")

    try {
      this.view.showLoading()

      // Check if user is authenticated
      const authModel = new AuthModel()
      if (!authModel.isAuthenticated()) {
        console.log("🔐 User not authenticated, redirecting to login...")
        // Redirect to login if not authenticated
        window.location.hash = "#/login"
        return
      }

      console.log("✅ User authenticated, loading stories...")
      const data = await this.model.getAllStories(1, 20, 1) // Get stories with location
      this.view.render(data.listStory)
      this.initializeMap(data.listStory)
      console.log("✅ Stories loaded successfully")
    } catch (error) {
      console.error("❌ Error loading stories:", error)

      // Show user-friendly error
      this.view.showError("Unable to load stories. Please check your connection and try again.")

      // If unauthorized, redirect to login
      if (error.message.includes("401") || error.message.includes("Unauthorized")) {
        console.log("🔐 Authentication expired, redirecting to login...")
        setTimeout(() => {
          window.location.hash = "#/login"
        }, 2000)
      }
    } finally {
      this.view.hideLoading()
    }
  }

  initializeMap(stories) {
    // Initialize map after view is rendered
    setTimeout(() => {
      const mapContainer = document.getElementById("stories-map")
      if (!mapContainer) return

      const map = L.map(mapContainer).setView([CONFIG.MAP.DEFAULT_LAT, CONFIG.MAP.DEFAULT_LNG], CONFIG.MAP.DEFAULT_ZOOM)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map)

      // Add markers for stories with location
      stories.forEach((story) => {
        if (story.lat && story.lon) {
          const marker = L.marker([story.lat, story.lon]).addTo(map)

          marker.bindPopup(`
            <div class="map-popup">
              <img src="${story.photoUrl}" alt="${story.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px;" />
              <h4>${story.name}</h4>
              <p>${story.description.substring(0, 100)}...</p>
              <small>${new Date(story.createdAt).toLocaleDateString("id-ID")}</small>
            </div>
          `)
        }
      })

      // Fit map to show all markers
      const group = new L.featureGroup(
        stories.filter((story) => story.lat && story.lon).map((story) => L.marker([story.lat, story.lon])),
      )

      if (group.getLayers().length > 0) {
        map.fitBounds(group.getBounds().pad(0.1))
      }
    }, 100)
  }

  initializeEventListeners() {
    document.addEventListener("addToFavorites", (event) => {
      this.handleAddToFavorites(event.detail.story)
    })
  }

  async handleAddToFavorites(story) {
    try {
      await this.dbHelper.addToFavorites(story)

      // Show success notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Added to Favorites!", {
          body: `"${story.name}" has been saved to your favorites`,
          icon: "/icons/icon-192x192.png",
        })
      }

      console.log("✅ Story added to favorites:", story.name)
    } catch (error) {
      console.error("❌ Error adding to favorites:", error)
    }
  }
}

export default HomePresenter
