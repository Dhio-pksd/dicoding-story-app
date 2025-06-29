// Import CONFIG from the appropriate module
import CONFIG from "./config"

// Authentication Model
class AuthModel {
  constructor() {
    this.baseUrl = CONFIG.API_BASE_URL
  }

  // Register new user
  async register(name, email, password) {
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      return data
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Store token and user data
      localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, data.loginResult.token)
      localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(data.loginResult))

      return data
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN)
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER)
  }

  // Check if user is authenticated
  isAuthenticated() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN) !== null
  }

  // Get current user
  getCurrentUser() {
    const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER)
    return userData ? JSON.parse(userData) : null
  }
}
