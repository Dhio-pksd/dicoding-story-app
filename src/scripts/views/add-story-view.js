import L from "leaflet"
import CONFIG from "../globals/config"
import CameraUtils from "../utils/camera-utils"

class AddStoryView {
  constructor() {
    this.container = document.getElementById("app-container")
    this.currentStream = null
    this.selectedLocation = null
    this.map = null
    this.capturedPhotoBlob = null
  }

  render() {
    this.container.innerHTML = `
      <section class="add-story-section">
        <div class="form-container">
          <header class="section-header">
            <h2>Share Your Story</h2>
            <p>Tell the Dicoding community about your experience</p>
          </header>
          
          <form id="add-story-form" class="story-form">
            <div class="form-group">
              <label for="story-description" class="form-label">
                Story Description *
              </label>
              <textarea 
                id="story-description" 
                name="description" 
                class="form-textarea" 
                placeholder="Share your story..."
                required
                aria-describedby="description-help"
              ></textarea>
              <small id="description-help" class="form-help">
                Describe your experience or story you want to share
              </small>
            </div>
            
            <div class="form-group">
              <label class="form-label">Photo *</label>
              <div class="camera-container">
                <video id="camera-preview" class="camera-preview hidden" autoplay playsinline></video>
                <canvas id="photo-canvas" class="camera-preview hidden"></canvas>
                <img id="captured-photo" class="camera-preview hidden" alt="Captured photo" />
                
                <div class="camera-controls">
                  <button type="button" id="start-camera-btn" class="btn">
                    📷 Start Camera
                  </button>
                  <button type="button" id="capture-btn" class="btn hidden">
                    📸 Capture Photo
                  </button>
                  <button type="button" id="retake-btn" class="btn btn-secondary hidden">
                    🔄 Retake Photo
                  </button>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Location (Optional)</label>
              <p class="form-help">Click on the map to select location</p>
              <div id="location-map" class="map-container"></div>
              <div id="selected-location" class="selected-location hidden">
                <p>Selected Location: <span id="location-coords"></span></p>
                <button type="button" id="clear-location-btn" class="btn btn-secondary">
                  Clear Location
                </button>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="submit" id="submit-btn" class="btn" disabled>
                Share Story
              </button>
              <button type="button" id="cancel-btn" class="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
          
          <div id="form-messages"></div>
        </div>
      </section>
    `

    this.initializeEventListeners()
    this.initializeMap()
  }

  initializeEventListeners() {
    const startCameraBtn = document.getElementById("start-camera-btn")
    const captureBtn = document.getElementById("capture-btn")
    const retakeBtn = document.getElementById("retake-btn")
    const clearLocationBtn = document.getElementById("clear-location-btn")
    const cancelBtn = document.getElementById("cancel-btn")
    const form = document.getElementById("add-story-form")
    const descriptionInput = document.getElementById("story-description")

    startCameraBtn.addEventListener("click", () => this.startCamera())
    captureBtn.addEventListener("click", () => this.capturePhoto())
    retakeBtn.addEventListener("click", () => this.retakePhoto())
    clearLocationBtn.addEventListener("click", () => this.clearLocation())
    cancelBtn.addEventListener("click", () => this.cancel())
    form.addEventListener("submit", (e) => this.handleSubmit(e))
    descriptionInput.addEventListener("input", () => this.validateForm())
  }

  initializeMap() {
    const mapContainer = document.getElementById("location-map")

    this.map = L.map(mapContainer).setView([CONFIG.MAP.DEFAULT_LAT, CONFIG.MAP.DEFAULT_LNG], CONFIG.MAP.DEFAULT_ZOOM)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(this.map)

    this.map.on("click", (e) => {
      this.selectLocation(e.latlng.lat, e.latlng.lng)
    })
  }

  async startCamera() {
    try {
      this.currentStream = await CameraUtils.startCamera()
      const video = document.getElementById("camera-preview")

      video.srcObject = this.currentStream
      video.classList.remove("hidden")

      document.getElementById("start-camera-btn").classList.add("hidden")
      document.getElementById("capture-btn").classList.remove("hidden")

      this.validateForm()
    } catch (error) {
      this.showMessage("Failed to start camera: " + error.message, "error")
    }
  }

  async capturePhoto() {
    try {
      this.capturedPhotoBlob = await CameraUtils.capturePhoto()
      const photoUrl = URL.createObjectURL(this.capturedPhotoBlob)

      const capturedPhoto = document.getElementById("captured-photo")
      capturedPhoto.src = photoUrl
      capturedPhoto.classList.remove("hidden")

      document.getElementById("camera-preview").classList.add("hidden")
      document.getElementById("capture-btn").classList.add("hidden")
      document.getElementById("retake-btn").classList.remove("hidden")

      this.validateForm()
    } catch (error) {
      this.showMessage("Failed to capture photo: " + error.message, "error")
    }
  }

  retakePhoto() {
    document.getElementById("captured-photo").classList.add("hidden")
    document.getElementById("camera-preview").classList.remove("hidden")
    document.getElementById("capture-btn").classList.remove("hidden")
    document.getElementById("retake-btn").classList.add("hidden")

    this.capturedPhotoBlob = null
    this.validateForm()
  }

  selectLocation(lat, lng) {
    this.selectedLocation = { lat, lng }

    // Clear existing markers
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer)
      }
    })

    // Add new marker
    L.marker([lat, lng])
      .addTo(this.map)
      .bindPopup(`Selected Location<br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`)
      .openPopup()

    // Show selected location info
    document.getElementById("selected-location").classList.remove("hidden")
    document.getElementById("location-coords").textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }

  clearLocation() {
    this.selectedLocation = null

    // Clear markers
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer)
      }
    })

    document.getElementById("selected-location").classList.add("hidden")
  }

  validateForm() {
    const description = document.getElementById("story-description").value.trim()
    const hasPhoto = this.capturedPhotoBlob !== null
    const submitBtn = document.getElementById("submit-btn")

    submitBtn.disabled = !(description && hasPhoto)
  }

  async handleSubmit(event) {
    event.preventDefault()

    const description = document.getElementById("story-description").value.trim()

    if (!description || !this.capturedPhotoBlob) {
      this.showMessage("Please fill in all required fields", "error")
      return
    }

    try {
      this.showLoading()

      const lat = this.selectedLocation ? this.selectedLocation.lat : null
      const lng = this.selectedLocation ? this.selectedLocation.lng : null

      // Trigger submit event for presenter
      const submitEvent = new CustomEvent("storySubmit", {
        detail: {
          description,
          photo: this.capturedPhotoBlob,
          lat,
          lng,
        },
      })

      document.dispatchEvent(submitEvent)
    } catch (error) {
      this.hideLoading()
      this.showMessage("Failed to submit story: " + error.message, "error")
    }
  }

  cancel() {
    this.cleanup()
    window.location.hash = "#/home"
  }

  cleanup() {
    if (this.currentStream) {
      CameraUtils.stopCamera(this.currentStream)
      this.currentStream = null
    }

    if (this.map) {
      this.map.remove()
      this.map = null
    }
  }

  showLoading() {
    document.getElementById("loading-spinner").classList.remove("hidden")
  }

  hideLoading() {
    document.getElementById("loading-spinner").classList.add("hidden")
  }

  showMessage(message, type = "info") {
    const messagesContainer = document.getElementById("form-messages")
    const messageClass = type === "error" ? "error-message" : "success-message"

    messagesContainer.innerHTML = `
      <div class="${messageClass}">
        ${message}
      </div>
    `

    // Auto hide after 5 seconds
    setTimeout(() => {
      messagesContainer.innerHTML = ""
    }, 5000)
  }

  showSuccess() {
    this.hideLoading()
    this.showMessage("Story shared successfully!", "success")

    // Redirect after 2 seconds
    setTimeout(() => {
      window.location.hash = "#/home"
    }, 2000)
  }

  showError(message) {
    this.hideLoading()
    this.showMessage(message, "error")
  }
}

export default AddStoryView
