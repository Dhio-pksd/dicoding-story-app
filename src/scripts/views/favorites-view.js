class FavoritesView {
  constructor() {
    this.container = document.getElementById("app-container")
  }

  render(favorites = []) {
    this.container.innerHTML = `
      <section class="favorites-section">
        <header class="section-header">
          <h2>⭐ Favorite Stories</h2>
          <p>Your saved stories for offline reading</p>
        </header>
        
        <div id="favorites-container">
          ${this.renderFavorites(favorites)}
        </div>
        
        <div class="favorites-actions">
          <button id="clear-favorites-btn" class="btn btn-danger" ${favorites.length === 0 ? "disabled" : ""}>
            🗑️ Clear All Favorites
          </button>
        </div>
      </section>
    `

    this.initializeEventListeners()
  }

  renderFavorites(favorites) {
    if (!favorites || favorites.length === 0) {
      return `
        <div class="empty-state">
          <h3>No favorite stories yet</h3>
          <p>Add stories to favorites to read them offline!</p>
          <a href="#/home" class="btn">Browse Stories</a>
        </div>
      `
    }

    return `
      <div class="stories-grid">
        ${favorites.map((story) => this.renderFavoriteCard(story)).join("")}
      </div>
    `
  }

  renderFavoriteCard(story) {
    const addedDate = new Date(story.addedAt).toLocaleDateString("id-ID")

    return `
      <article class="story-card favorite-card" role="article">
        <img 
          src="${story.photoUrl}" 
          alt="Story photo by ${story.name}"
          class="story-image"
          loading="lazy"
        />
        <div class="story-content">
          <h3 class="story-title">${story.name}</h3>
          <p class="story-description">${story.description}</p>
          <div class="story-meta">
            <span class="story-date">Added: ${addedDate}</span>
            ${story.lat && story.lon ? '<span class="story-location">📍 Location available</span>' : ""}
          </div>
          <div class="favorite-actions">
            <button class="btn btn-danger btn-small remove-favorite-btn" data-id="${story.id}">
              ❌ Remove from Favorites
            </button>
          </div>
        </div>
      </article>
    `
  }

  initializeEventListeners() {
    // Remove individual favorite
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-favorite-btn")) {
        const storyId = e.target.getAttribute("data-id")
        this.removeFavorite(storyId)
      }
    })

    // Clear all favorites
    const clearBtn = document.getElementById("clear-favorites-btn")
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.clearAllFavorites()
      })
    }
  }

  removeFavorite(storyId) {
    const event = new CustomEvent("removeFavorite", {
      detail: { storyId },
    })
    document.dispatchEvent(event)
  }

  clearAllFavorites() {
    if (confirm("Are you sure you want to remove all favorite stories?")) {
      const event = new CustomEvent("clearAllFavorites")
      document.dispatchEvent(event)
    }
  }

  showLoading() {
    document.getElementById("loading-spinner").classList.remove("hidden")
  }

  hideLoading() {
    document.getElementById("loading-spinner").classList.add("hidden")
  }

  showMessage(message, type = "info") {
    const container = document.getElementById("favorites-container")
    const messageClass = type === "error" ? "error-message" : "success-message"

    const messageDiv = document.createElement("div")
    messageDiv.className = messageClass
    messageDiv.textContent = message

    container.insertBefore(messageDiv, container.firstChild)

    setTimeout(() => {
      messageDiv.remove()
    }, 3000)
  }
}

export default FavoritesView
