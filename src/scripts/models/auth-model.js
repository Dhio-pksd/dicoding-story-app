import CONFIG from "../globals/config"

class AuthModel {
  constructor() {
    this.baseUrl = CONFIG.API_BASE_URL
  }

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

  logout() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN)
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER)
  }

  isAuthenticated() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN) !== null
  }

  getCurrentUser() {
    const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER)
    return userData ? JSON.parse(userData) : null
  }
}

export default AuthModel
