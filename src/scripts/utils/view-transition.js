class ViewTransition {
  static isSupported() {
    return "startViewTransition" in document
  }

  static async transition(callback) {
    if (this.isSupported()) {
      return document.startViewTransition(callback)
    } else {
      // Fallback for browsers that don't support View Transition API
      return callback()
    }
  }

  static addTransitionName(element, name) {
    if (this.isSupported()) {
      element.style.viewTransitionName = name
    }
  }

  static removeTransitionName(element) {
    if (this.isSupported()) {
      element.style.viewTransitionName = ""
    }
  }
}

export default ViewTransition
