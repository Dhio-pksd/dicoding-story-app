import PushNotificationService from "./push-notification-service.js"

class PWAManager {
  constructor() {
    this.pushService = new PushNotificationService()
    this.deferredPrompt = null
    this.isInstalled = false
  }

  init() {
    this.initializeInstallPrompt()
    this.initializeNotifications()
    this.initializeOfflineDetection()
  }

  initializeInstallPrompt() {
    // Listen for beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", (e) => {
      console.log("📱 PWA: Install prompt available")
      e.preventDefault()
      this.deferredPrompt = e
      this.showInstallBanner()
    })

    // Listen for appinstalled event
    window.addEventListener("appinstalled", () => {
      console.log("✅ PWA: App installed successfully")
      this.isInstalled = true
      this.hideInstallBanner()
      this.showLocalNotification("App Installed!", {
        body: "Dicoding Story App has been installed successfully!",
      })
    })

    // Install button click
    const installButton = document.getElementById("install-button")
    if (installButton) {
      installButton.addEventListener("click", () => {
        this.installApp()
      })
    }

    // Dismiss install banner
    const dismissButton = document.getElementById("dismiss-install")
    if (dismissButton) {
      dismissButton.addEventListener("click", () => {
        this.hideInstallBanner()
      })
    }
  }

  initializeNotifications() {
    const notificationToggle = document.getElementById("notification-toggle")
    if (notificationToggle) {
      notificationToggle.addEventListener("click", () => {
        this.toggleNotifications()
      })
    }

    // Check current notification status
    this.updateNotificationButton()
  }

  initializeOfflineDetection() {
    window.addEventListener("online", () => {
      console.log("🌐 Back online")
      this.hideOfflineBanner()
      this.showLocalNotification("Back Online!", {
        body: "Your internet connection has been restored.",
      })
    })

    window.addEventListener("offline", () => {
      console.log("📡 Gone offline")
      this.showOfflineBanner()
    })

    // Check initial status
    if (!navigator.onLine) {
      this.showOfflineBanner()
    }
  }

  async installApp() {
    if (!this.deferredPrompt) {
      console.log("❌ PWA: No install prompt available")
      return
    }

    try {
      this.deferredPrompt.prompt()
      const { outcome } = await this.deferredPrompt.userChoice

      if (outcome === "accepted") {
        console.log("✅ PWA: User accepted install")
      } else {
        console.log("❌ PWA: User dismissed install")
      }

      this.deferredPrompt = null
      this.hideInstallBanner()
    } catch (error) {
      console.error("❌ PWA: Install failed:", error)
    }
  }

  async toggleNotifications() {
    try {
      const subscription = await this.pushService.getSubscription()

      if (subscription) {
        // Unsubscribe
        await this.pushService.unsubscribe()
        this.updateNotificationButton(false)
        this.showLocalNotification("Notifications Disabled", {
          body: "You will no longer receive push notifications.",
        })
      } else {
        // Subscribe
        await this.pushService.requestPermission()
        await this.pushService.subscribe()
        this.updateNotificationButton(true)
        this.showLocalNotification("Notifications Enabled!", {
          body: "You will now receive push notifications.",
        })
      }
    } catch (error) {
      console.error("❌ Notification toggle failed:", error)
      alert("Failed to toggle notifications: " + error.message)
    }
  }

  updateNotificationButton(isSubscribed = null) {
    const button = document.getElementById("notification-toggle")
    if (!button) return

    if (isSubscribed === null) {
      // Check current status
      this.pushService.getSubscription().then((subscription) => {
        if (subscription) {
          button.textContent = "🔔"
          button.title = "Notifications enabled - Click to disable"
        } else {
          button.textContent = "🔕"
          button.title = "Notifications disabled - Click to enable"
        }
      })
    } else {
      if (isSubscribed) {
        button.textContent = "🔔"
        button.title = "Notifications enabled - Click to disable"
      } else {
        button.textContent = "🔕"
        button.title = "Notifications disabled - Click to enable"
      }
    }
  }

  showInstallBanner() {
    const banner = document.getElementById("install-banner")
    if (banner) {
      banner.classList.remove("hidden")
    }
  }

  hideInstallBanner() {
    const banner = document.getElementById("install-banner")
    if (banner) {
      banner.classList.add("hidden")
    }
  }

  showOfflineBanner() {
    const banner = document.getElementById("offline-banner")
    if (banner) {
      banner.classList.remove("hidden")
    }

    const dismissButton = document.getElementById("dismiss-offline")
    if (dismissButton) {
      dismissButton.addEventListener("click", () => {
        this.hideOfflineBanner()
      })
    }
  }

  hideOfflineBanner() {
    const banner = document.getElementById("offline-banner")
    if (banner) {
      banner.classList.add("hidden")
    }
  }

  async showLocalNotification(title, options = {}) {
    try {
      await this.pushService.showLocalNotification(title, options)
    } catch (error) {
      console.error("❌ Local notification failed:", error)
    }
  }
}

export default PWAManager
