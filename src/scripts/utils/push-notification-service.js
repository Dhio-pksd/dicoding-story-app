class PushNotificationService {
  constructor() {
    // VAPID Public Key dari Dicoding API
    this.vapidPublicKey = "BN7-r0Svv7CsTi18-OPYtJLVW0bfuZ1x1UtrygczKjNrhbJLaC-RuVW6K_5OC-Ox-_NQ2Y4Ey1IjHlWhWGpghUU"
    this.isSupported = "serviceWorker" in navigator && "PushManager" in window
    this.subscription = null
  }

  isNotificationSupported() {
    return this.isSupported
  }

  async requestPermission() {
    if (!this.isSupported) {
      throw new Error("Push notifications are not supported")
    }

    const permission = await Notification.requestPermission()

    if (permission === "granted") {
      console.log("✅ Push Notification: Permission granted")
      return true
    } else {
      console.log("❌ Push Notification: Permission denied")
      throw new Error("Notification permission denied")
    }
  }

  async subscribe() {
    try {
      if (!this.isSupported) {
        throw new Error("Push notifications are not supported")
      }

      const registration = await navigator.serviceWorker.ready
      const existingSubscription = await registration.pushManager.getSubscription()

      if (existingSubscription) {
        console.log("✅ Already subscribed to push notifications")
        this.subscription = existingSubscription
        return existingSubscription
      }

      const applicationServerKey = this.urlBase64ToUint8Array(this.vapidPublicKey)

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      })

      console.log("✅ Subscribed to push notifications")
      this.subscription = subscription

      return subscription
    } catch (error) {
      console.error("❌ Push subscription failed:", error)
      throw error
    }
  }

  async unsubscribe() {
    try {
      if (!this.subscription) {
        const registration = await navigator.serviceWorker.ready
        this.subscription = await registration.pushManager.getSubscription()
      }

      if (this.subscription) {
        await this.subscription.unsubscribe()
        console.log("✅ Unsubscribed from push notifications")
        this.subscription = null
        return true
      }

      return false
    } catch (error) {
      console.error("❌ Push unsubscribe failed:", error)
      throw error
    }
  }

  async getSubscription() {
    if (!this.isSupported) return null

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      this.subscription = subscription
      return subscription
    } catch (error) {
      console.error("❌ Get subscription failed:", error)
      return null
    }
  }

  async showLocalNotification(title, options = {}) {
    if (!this.isSupported) {
      throw new Error("Notifications are not supported")
    }

    const permission = await Notification.requestPermission()
    if (permission === "granted") {
      const notification = new Notification(title, {
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        ...options,
      })

      setTimeout(() => {
        notification.close()
      }, 5000)

      return notification
    }
  }

  urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
}

export default PushNotificationService
