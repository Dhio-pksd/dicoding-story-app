import Router from "./utils/router"
import StoryModel from "./models/story-model"
import AuthModel from "./models/auth-model"
import HomeView from "./views/home-view"
import AddStoryView from "./views/add-story-view"
import LoginView from "./views/login-view"
import RegisterView from "./views/register-view"
import HomePresenter from "./presenters/home-presenter"
import AddStoryPresenter from "./presenters/add-story-presenter"
import AuthPresenter from "./presenters/auth-presenter"
import CONFIG from "./globals/config"

class App {
  constructor() {
    this.router = new Router()
    this.models = {
      story: new StoryModel(),
      auth: new AuthModel(),
    }
    this.views = {
      home: new HomeView(),
      addStory: new AddStoryView(),
      login: new LoginView(),
      register: new RegisterView(),
    }
    this.presenters = {
      home: new HomePresenter(this.models.story, this.views.home),
      addStory: new AddStoryPresenter(this.models.story, this.views.addStory),
      auth: new AuthPresenter(this.models.auth, this.views.login, this.views.register),
    }
  }

  init() {
    this.initializeRoutes()
    this.initializeNavigation()
  }

  initializeRoutes() {
    // Define routes
    this.router.addRoute("/home", () => {
      this.presenters.home.init()
    })

    this.router.addRoute("/add-story", () => {
      this.presenters.addStory.init()
    })

    this.router.addRoute("/login", () => {
      this.views.login.render()
    })

    this.router.addRoute("/register", () => {
      this.views.register.render()
    })

    this.router.addRoute("/logout", () => {
      this.presenters.auth.logout()
    })

    // Default route
    this.router.addRoute("/", () => {
      this.router.navigate("/home")
    })
  }

  initializeNavigation() {
    // Update navigation based on authentication status
    this.updateNavigation()

    // Listen for authentication changes
    window.addEventListener("storage", (e) => {
      if (e.key === CONFIG.STORAGE_KEYS.TOKEN) {
        this.updateNavigation()
      }
    })
  }

  updateNavigation() {
    const authLink = document.getElementById("auth-link")
    const isAuthenticated = this.models.auth.isAuthenticated()

    if (isAuthenticated) {
      const user = this.models.auth.getCurrentUser()
      authLink.textContent = `Logout (${user.name})`
      authLink.href = "#/logout"
    } else {
      authLink.textContent = "Login"
      authLink.href = "#/login"
    }
  }
}

export default App
