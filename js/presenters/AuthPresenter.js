// Authentication Presenter
class AuthPresenter {
  constructor(model, loginView, registerView) {
    this.model = model
    this.loginView = loginView
    this.registerView = registerView
    this.initializeEventListeners()
  }

  initializeEventListeners() {
    document.addEventListener("userLogin", (event) => {
      this.handleLogin(event.detail)
    })

    document.addEventListener("userRegister", (event) => {
      this.handleRegister(event.detail)
    })
  }

  async handleLogin(data) {
    try {
      this.loginView.showLoading()

      await this.model.login(data.email, data.password)
      this.loginView.showSuccess()
    } catch (error) {
      console.error("Login error:", error)
      this.loginView.showError(error.message)
    }
  }

  async handleRegister(data) {
    try {
      this.registerView.showLoading()

      await this.model.register(data.name, data.email, data.password)
      this.registerView.showSuccess()
    } catch (error) {
      console.error("Registration error:", error)
      this.registerView.showError(error.message)
    }
  }

  logout() {
    this.model.logout()
    this.updateNavigation()
    window.location.hash = "#/login"
  }

  updateNavigation() {
    const authLink = document.getElementById("auth-link")
    const isAuthenticated = this.model.isAuthenticated()

    if (isAuthenticated) {
      authLink.textContent = "Logout"
      authLink.href = "#/logout"
    } else {
      authLink.textContent = "Login"
      authLink.href = "#/login"
    }
  }
}
