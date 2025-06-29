# Dicoding Story App

Aplikasi Single-Page Application (SPA) untuk berbagi cerita seputar Dicoding menggunakan Dicoding Story API.

## Features

- 📱 Single-Page Application dengan hash routing
- 🏗️ Arsitektur MVP (Model-View-Presenter)
- 📷 Integrasi kamera untuk mengambil foto
- 🗺️ Peta interaktif dengan marker lokasi
- 🔐 Sistem autentikasi (login/register)
- ♿ Aksesibilitas yang baik
- 🎨 View Transition API untuk transisi halus
- 📦 Webpack build system
- 🎯 Responsive design

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), CSS3, HTML5
- **Build Tool**: Webpack 5
- **Map**: Leaflet.js dengan OpenStreetMap
- **API**: Dicoding Story API
- **Transpiler**: Babel

## Installation

1. Clone repository:
\`\`\`bash
git clone [repository-url]
cd dicoding-story-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start development server:
\`\`\`bash
npm run start-dev
\`\`\`

4. Build for production:
\`\`\`bash
npm run build
\`\`\`

## Available Scripts

- `npm run start-dev` - Start development server dengan hot reload
- `npm run build` - Build untuk production
- `npm run build-dev` - Build untuk development

## Project Structure

\`\`\`
src/
├── scripts/           # JavaScript modules
│   ├── globals/       # Configuration
│   ├── models/        # Data models
│   ├── views/         # UI views
│   ├── presenters/    # Business logic
│   └── utils/         # Utility functions
├── styles/            # CSS files
├── templates/         # HTML templates
└── public/            # Static assets
\`\`\`

## API Endpoints

Base URL: `https://story-api.dicoding.dev/v1`

- `POST /register` - Register user baru
- `POST /login` - Login user
- `GET /stories` - Ambil daftar stories
- `POST /stories` - Tambah story baru
- `GET /stories/:id` - Detail story

## Browser Support

- Chrome 88+
- Firefox 87+
- Safari 14+
- Edge 88+

## License

MIT License
