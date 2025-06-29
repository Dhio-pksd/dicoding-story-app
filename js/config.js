// Configuration file
const CONFIG = {
  API_BASE_URL: "https://story-api.dicoding.dev/v1",
  STORAGE_KEYS: {
    TOKEN: "dicoding_story_token",
    USER: "dicoding_story_user",
  },
  MAP: {
    DEFAULT_LAT: -6.2088,
    DEFAULT_LNG: 106.8456,
    DEFAULT_ZOOM: 10,
  },
  CAMERA: {
    VIDEO_CONSTRAINTS: {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "environment",
      },
    },
  },
}
