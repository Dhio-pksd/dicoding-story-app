import CONFIG from "../globals/config"

class StoryModel {
  constructor() {
    this.baseUrl = CONFIG.API_BASE_URL
  }

  async getAllStories(page = 1, size = 10, location = 0) {
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN)
      const url = new URL(`${this.baseUrl}/stories`)

      url.searchParams.append("page", page)
      url.searchParams.append("size", size)
      url.searchParams.append("location", location)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch stories")
      }

      return data
    } catch (error) {
      console.error("Error fetching stories:", error)
      throw error
    }
  }

  async getStoryDetail(id) {
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN)
      const response = await fetch(`${this.baseUrl}/stories/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch story detail")
      }

      return data
    } catch (error) {
      console.error("Error fetching story detail:", error)
      throw error
    }
  }

  async addStory(description, photo, lat = null, lon = null) {
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN)
      const formData = new FormData()

      formData.append("description", description)
      formData.append("photo", photo)

      if (lat !== null && lon !== null) {
        formData.append("lat", lat)
        formData.append("lon", lon)
      }

      const response = await fetch(`${this.baseUrl}/stories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to add story")
      }

      return data
    } catch (error) {
      console.error("Error adding story:", error)
      throw error
    }
  }

  async addStoryAsGuest(description, photo, lat = null, lon = null) {
    try {
      const formData = new FormData()

      formData.append("description", description)
      formData.append("photo", photo)

      if (lat !== null && lon !== null) {
        formData.append("lat", lat)
        formData.append("lon", lon)
      }

      const response = await fetch(`${this.baseUrl}/stories/guest`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to add story as guest")
      }

      return data
    } catch (error) {
      console.error("Error adding story as guest:", error)
      throw error
    }
  }
}

export default StoryModel
