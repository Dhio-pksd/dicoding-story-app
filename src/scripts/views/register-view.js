class RegisterView {
  constructor() {
    this.container = document.getElementById("app-container")
  }

  render() {
    this.container.innerHTML = `
      <section class="auth-section">
        <div class="form-container">
          <header class="section-header">
            <h2>Create New Account</h2>
            <p>Join the Dicoding community and start sharing your stories</p>
          </header>
          
          <form id="register-form" class="auth-form">
            <div class="form-group">
              <label for="register-name" class="form-label">Full Name</label>
              <input 
                type="text" 
                id="register-name" 
                name="name" 
                class="form-input" 
                placeholder="Enter your full name"
                required
                autocomplete="name"
              />
            </div>
            
            <div class="form-group">
              <label for="register-email" class="form-label">Email Address</label>
              <input 
                type="email" 
                id="register-email" 
                name="email" 
                class="form-input" 
                placeholder="Enter your email"
                required
                autocomplete="email"
              />
            </div>
            
            <div class="form-group">
              <label for="register-password" class="form-label">Password</label>
              <input 
                type="password" 
                id="register-password" 
                name="password" 
                class="form-input" 
                placeholder="Enter your password (min. 8 characters)"
                required
                minlength="8"
                autocomplete="new-password"
              />
              <small class="form-help">Password must be at least 8 characters long</small>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn">Create Account</button>
            </div>
          </form>
          
          <div class="auth-links">
            <p>Already have an account? <a href="#/login">Sign in here</a></p>
          </div>
          
          <div id="auth-messages"></div>
        </div>
      </section>
    `

    this.initializeEventListeners()
  }

  initializeEventListeners() {
    const form = document.getElementById("register-form")
    form.addEventListener("submit", (e) => this.handleSubmit(e))
  }

  async handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const name = formData.get("name")
    const email = formData.get("email")
    const password = formData.get("password")

    if (!name || !email || !password) {
      this.showMessage("Please fill in all fields", "error")
      return
    }

    if (password.length < 8) {
      this.showMessage("Password must be at least 8 characters long", "error")
      return
    }

    // Trigger register event for presenter
    const registerEvent = new CustomEvent("userRegister", {
      detail: { name, email, password },
    })

    document.dispatchEvent(registerEvent)
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
    this.showMessage("Registration successful! Please login to continue.", "success")

    // Redirect to login after 2 seconds
    setTimeout(() => {
      window.location.hash = "#/login"
    }, 2000)
  }

  showError(message) {
    this.hideLoading()
    this.showMessage(message, "error")
  }
}

export default RegisterView
