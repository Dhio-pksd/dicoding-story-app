class LoginView {
  constructor() {
    this.container = document.getElementById("app-container")
  }

  render() {
    this.container.innerHTML = `
      <section class="auth-section">
        <div class="form-container">
          <header class="section-header">
            <h2>Login to Your Account</h2>
            <p>Welcome back! Please sign in to continue</p>
          </header>
          
          <form id="login-form" class="auth-form">
            <div class="form-group">
              <label for="login-email" class="form-label">Email Address</label>
              <input 
                type="email" 
                id="login-email" 
                name="email" 
                class="form-input" 
                placeholder="Enter your email"
                required
                autocomplete="email"
              />
            </div>
            
            <div class="form-group">
              <label for="login-password" class="form-label">Password</label>
              <input 
                type="password" 
                id="login-password" 
                name="password" 
                class="form-input" 
                placeholder="Enter your password"
                required
                autocomplete="current-password"
              />
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn">Sign In</button>
            </div>
          </form>
          
          <div class="auth-links">
            <p>Don't have an account? <a href="#/register">Sign up here</a></p>
          </div>
          
          <div id="auth-messages"></div>
        </div>
      </section>
    `

    this.initializeEventListeners()
  }

  initializeEventListeners() {
    const form = document.getElementById("login-form")
    form.addEventListener("submit", (e) => this.handleSubmit(e))
  }

  async handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const email = formData.get("email")
    const password = formData.get("password")

    if (!email || !password) {
      this.showMessage("Please fill in all fields", "error")
      return
    }

    // Trigger login event for presenter
    const loginEvent = new CustomEvent("userLogin", {
      detail: { email, password },
    })

    document.dispatchEvent(loginEvent)
  }

  showLoading() {
    document.getElementById("loading-spinner").classList.remove("hidden")
  }

  hideLoading() {
    document.getElementById("loading-spinner").classList.add("hidden")
  }

  showMessage(message, type = "info") {
    const messagesContainer = document.getElementById("auth-messages")
    const messageClass = type === "error" ? "error-message" : "success-message"

    messagesContainer.innerHTML = `
      <div class="${messageClass}">
        ${message}
      </div>
    `
  }

  showSuccess() {
    this.hideLoading()
    this.showMessage("Login successful! Redirecting...", "success")

    // Update navigation
    this.updateNavigation()

    // Redirect after 1 second
    setTimeout(() => {
      window.location.hash = "#/home"
    }, 1000)
  }

  showError(message) {
    this.hideLoading()
    this.showMessage(message, "error")
  }

  updateNavigation() {
    const authLink = document.getElementById("auth-link")
    authLink.textContent = "Logout"
    authLink.href = "#/logout"
  }
}

export default LoginView
