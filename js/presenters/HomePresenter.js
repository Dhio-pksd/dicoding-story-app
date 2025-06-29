// Home Presenter - MVP Pattern
import AuthModel from "../models/AuthModel"
import L from "leaflet"
import CONFIG from "../config"

class HomePresenter {
  constructor(model, view) {
    this.model = model
    this.view = view
  }

  async init() {
    try {
      this.view.showLoading()

      // Check if user is authenticated
      const authModel = new AuthModel()
      if (!authModel.isAuthenticated()) {
        // Redirect to login if not authenticated
        window.location.hash = "#/login"
        return
      }

      const data = await this.model.getAllStories(1, 20, 1) // Get stories with location
      this.view.render(data.listStory)
      this.initializeMap(data.listStory)
    } catch (error) {
      console.error("Error loading stories:", error)
      this.view.showError(error.message)
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
}
