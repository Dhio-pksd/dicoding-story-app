// Add Story Presenter
import AuthModel from "../models/AuthModel" // Import AuthModel

class AddStoryPresenter {
  constructor(model, view) {
    this.model = model
    this.view = view
    this.initializeEventListeners()
  }

  initializeEventListeners() {
    document.addEventListener("storySubmit", (event) => {
      this.handleStorySubmit(event.detail)
    })
  }

  async init() {
    // Check if user is authenticated
    const authModel = new AuthModel()
    if (!authModel.isAuthenticated()) {
      // Redirect to login if not authenticated
      window.location.hash = "#/login"
      return
    }

    this.view.render()
  }

  async handleStorySubmit(data) {
    try {
      this.view.showLoading()

      await this.model.addStory(data.description, data.photo, data.lat, data.lng)

      this.view.showSuccess()
    } catch (error) {
      console.error("Error adding story:", error)
      this.view.showError(error.message)
    }
  }
}
