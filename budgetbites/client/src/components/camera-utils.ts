// Camera utility functions for voice and gesture controls

interface CameraManager {
  getVideoElement(): HTMLVideoElement | null;
  isActive(): boolean;
  start(): Promise<MediaStream>;
  stop(): void;
}

class SimpleCameraManager implements CameraManager {
  private videoElement: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;

  getVideoElement(): HTMLVideoElement | null {
    // Try to find existing video element from AR scanner
    const existingVideo = document.querySelector('video') as HTMLVideoElement;
    if (existingVideo && existingVideo.srcObject) {
      this.videoElement = existingVideo;
      return existingVideo;
    }
    return this.videoElement;
  }

  isActive(): boolean {
    return this.stream !== null && this.stream.active;
  }

  async start(): Promise<MediaStream> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });
      
      return this.stream;
    } catch (error) {
      console.error('Failed to start camera:', error);
      throw error;
    }
  }

  stop(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}

// Singleton camera manager
const cameraManager = new SimpleCameraManager();

export function useCamera() {
  return {
    cameraManager
  };
}