class HomeView {
  constructor() {
    this.container = document.getElementById("app-container")
  }

  render(stories = []) {
    this.container.innerHTML = `
      <section class="home-section">
        <header class="section-header">
          <h2>Latest Stories</h2>
          <p>Discover amazing stories from Dicoding community</p>
        </header>
        
        <div id="stories-container">
          ${this.renderStories(stories)}
        </div>
        
        <div id="map-section" class="map-section">
          <h3>Stories Location</h3>
          <div id="stories-map" class="map-container"></div>
        </div>
      </section>
    `
  }

  renderStories(stories) {
    if (!stories || stories.length === 0) {
      return `
        <div class="empty-state">
          <h3>No stories available</h3>
          <p>Be the first to share your story!</p>
          <a href="#/add-story" class="btn">Add Your Story</a>
        </div>
      `
    }

    return `
      <div class="stories-grid">
        ${stories.map((story) => this.renderStoryCard(story)).join("")}
      </div>
    `
  }

  renderStoryCard(story) {
    const createdDate = new Date(story.createdAt).toLocaleDateString("id-ID")

    return `
      <article class="story-card" role="article">
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
            <span class="story-date">${createdDate}</span>
            ${story.lat && story.lon ? '<span class="story-location">📍 Location available</span>' : ""}
          </div>
        </div>
      </article>
    `
  }

  showLoading() {
    document.getElementById("loading-spinner").classList.remove("hidden")
  }

  hideLoading() {
    document.getElementById("loading-spinner").classList.add("hidden")
  }

  showError(message) {
    this.container.innerHTML = `
      <div class="error-message">
        <h3>Error</h3>
        <p>${message}</p>
        <button onclick="location.reload()" class="btn">Try Again</button>
      </div>
    `
  }
}

export default HomeView
