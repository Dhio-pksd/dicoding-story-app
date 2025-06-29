// Import necessary libraries
import L from "leaflet"
import CONFIG from "./config" // Assuming CONFIG is defined in a separate config file

// Map utility functions
class MapUtils {
  static createMap(
    containerId,
    lat = CONFIG.MAP.DEFAULT_LAT,
    lng = CONFIG.MAP.DEFAULT_LNG,
    zoom = CONFIG.MAP.DEFAULT_ZOOM,
  ) {
    const map = L.map(containerId).setView([lat, lng], zoom)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map)

    return map
  }

  static addMarker(map, lat, lng, popupContent = "") {
    const marker = L.marker([lat, lng]).addTo(map)

    if (popupContent) {
      marker.bindPopup(popupContent)
    }

    return marker
  }

  static fitBounds(map, markers) {
    if (markers.length > 0) {
      const group = new L.featureGroup(markers)
      map.fitBounds(group.getBounds().pad(0.1))
    }
  }

  static getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      )
    })
  }
}
