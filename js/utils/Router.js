// Router utility for hash-based routing
class Router {
  constructor() {
    this.routes = {}
    this.currentRoute = null

    // Listen for hash changes
    window.addEventListener("hashchange", () => this.handleRouteChange())
    window.addEventListener("load", () => this.handleRouteChange())
  }

  // Add route
  addRoute(path, handler) {
    this.routes[path] = handler
  }

  // Handle route changes
  async handleRouteChange() {
    const hash = window.location.hash.slice(1) || "/home"
    const route = hash.split("?")[0] // Remove query parameters

    // Use View Transition API if supported
    if (document.startViewTransition && this.currentRoute !== route) {
      document.startViewTransition(() => {
        this.executeRoute(route)
      })
    } else {
      this.executeRoute(route)
    }

    this.currentRoute = route
  }

  // Execute route handler
  executeRoute(route) {
    const handler = this.routes[route]

    if (handler) {
      handler()
    } else {
      // Default route
      this.routes["/home"]()
    }
  }

  // Navigate to route
  navigate(path) {
    window.location.hash = path
  }
}
