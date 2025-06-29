import CONFIG from "../globals/config"

class CameraUtils {
  static async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(CONFIG.CAMERA.VIDEO_CONSTRAINTS)
      return stream
    } catch (error) {
      console.error("Error accessing camera:", error)
      throw new Error("Unable to access camera. Please check permissions.")
    }
  }

  static stopCamera(stream) {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop()
      })
    }
  }

  static async capturePhoto() {
    const video = document.getElementById("camera-preview")
    const canvas = document.getElementById("photo-canvas")
    const context = canvas.getContext("2d")

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob)
        },
        "image/jpeg",
        0.8,
      )
    })
  }
}

export default CameraUtils
