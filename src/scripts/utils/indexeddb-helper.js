class IndexedDBHelper {
  constructor() {
    this.dbName = "DicodingStoryDB"
    this.version = 1
    this.db = null
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        console.error("❌ IndexedDB: Error opening database")
        reject(request.error)
      }

      request.onsuccess = () => {
        console.log("✅ IndexedDB: Database opened")
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        console.log("🔄 IndexedDB: Database upgrade")
        const db = event.target.result

        // Stories Store
        if (!db.objectStoreNames.contains("stories")) {
          const storiesStore = db.createObjectStore("stories", {
            keyPath: "id",
          })
          storiesStore.createIndex("createdAt", "createdAt", { unique: false })
        }

        // Favorites Store
        if (!db.objectStoreNames.contains("favorites")) {
          const favoritesStore = db.createObjectStore("favorites", {
            keyPath: "id",
          })
          favoritesStore.createIndex("addedAt", "addedAt", { unique: false })
        }

        console.log("✅ IndexedDB: Database structure created")
      }
    })
  }

  async addData(storeName, data) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.put(data) // Use put instead of add to allow updates

      request.onsuccess = () => {
        console.log(`✅ IndexedDB: Data saved to ${storeName}`)
        resolve(request.result)
      }

      request.onerror = () => {
        console.error(`❌ IndexedDB: Error saving to ${storeName}`)
        reject(request.error)
      }
    })
  }

  async getAllData(storeName) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        console.error(`❌ IndexedDB: Error getting data from ${storeName}`)
        reject(request.error)
      }
    })
  }

  async deleteData(storeName, id) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)

      request.onsuccess = () => {
        console.log(`✅ IndexedDB: Data deleted from ${storeName}`)
        resolve(request.result)
      }

      request.onerror = () => {
        console.error(`❌ IndexedDB: Error deleting from ${storeName}`)
        reject(request.error)
      }
    })
  }

  // Stories specific methods
  async saveStories(stories) {
    const promises = stories.map((story) => {
      return this.addData("stories", {
        ...story,
        cachedAt: new Date().toISOString(),
      })
    })
    return Promise.all(promises)
  }

  async getCachedStories() {
    return this.getAllData("stories")
  }

  // Favorites specific methods
  async addToFavorites(story) {
    return this.addData("favorites", {
      ...story,
      addedAt: new Date().toISOString(),
    })
  }

  async getFavorites() {
    return this.getAllData("favorites")
  }

  async removeFromFavorites(storyId) {
    return this.deleteData("favorites", storyId)
  }

  async isFavorite(storyId) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["favorites"], "readonly")
      const store = transaction.objectStore("favorites")
      const request = store.get(storyId)

      request.onsuccess = () => {
        resolve(!!request.result)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }
}

export default IndexedDBHelper
