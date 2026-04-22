// Enhanced getUserMedia() utilities for AR Pantry Scanner
// Provides robust camera access with fallbacks and error handling
import { useState } from "react";

interface CameraConstraints {
  video: {
    facingMode: string;
    width?: { ideal: number };
    height?: { ideal: number };
    frameRate?: { ideal: number };
  };
  audio?: boolean;
}

interface CameraConfig {
  preferredCamera: 'environment' | 'user';
  resolution: 'low' | 'medium' | 'high';
  frameRate: number;
}

export class CameraManager {
  private stream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;

  // Enhanced getUserMedia with multiple fallback attempts
  async initializeCamera(config: CameraConfig = {
    preferredCamera: 'environment',
    resolution: 'medium',
    frameRate: 30
  }): Promise<HTMLVideoElement> {
    
    // Try multiple constraint configurations for maximum compatibility
    const constraintAttempts: CameraConstraints[] = [
      // Attempt 1: Ideal configuration
      {
        video: {
          facingMode: config.preferredCamera,
          width: { ideal: config.resolution === 'high' ? 1280 : config.resolution === 'medium' ? 640 : 320 },
          height: { ideal: config.resolution === 'high' ? 720 : config.resolution === 'medium' ? 480 : 240 },
          frameRate: { ideal: config.frameRate }
        }
      },
      // Attempt 2: Relaxed configuration
      {
        video: {
          facingMode: config.preferredCamera,
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      },
      // Attempt 3: Basic configuration
      {
        video: {
          facingMode: config.preferredCamera
        }
      },
      // Attempt 4: Any camera (basic boolean constraint)
      {
        video: {
          facingMode: 'environment'
        }
      }
    ];

    for (let i = 0; i < constraintAttempts.length; i++) {
      try {
        console.log(`Camera attempt ${i + 1}:`, constraintAttempts[i]);
        this.stream = await navigator.mediaDevices.getUserMedia(constraintAttempts[i]);
        
        if (this.stream) {
          console.log('Camera access successful');
          return this.createVideoElement();
        }
      } catch (error) {
        console.warn(`Camera attempt ${i + 1} failed:`, error);
        
        if (i === constraintAttempts.length - 1) {
          throw new Error(`Camera access failed after ${constraintAttempts.length} attempts: ${error}`);
        }
      }
    }

    throw new Error('Unable to access camera');
  }

  private createVideoElement(): HTMLVideoElement {
    if (!this.stream) {
      throw new Error('No camera stream available');
    }

    this.videoElement = document.createElement('video');
    this.videoElement.srcObject = this.stream;
    this.videoElement.autoplay = true;
    this.videoElement.muted = true;
    this.videoElement.playsInline = true;
    
    // Add attributes for AR.js compatibility
    this.videoElement.setAttribute('webkit-playsinline', 'true');
    this.videoElement.setAttribute('playsinline', 'true');
    
    return this.videoElement;
  }

  // Get camera capabilities and info
  getCameraInfo(): { 
    deviceId: string; 
    label: string; 
    capabilities: MediaTrackCapabilities;
  } | null {
    if (!this.stream) return null;

    const videoTrack = this.stream.getVideoTracks()[0];
    if (!videoTrack) return null;

    return {
      deviceId: videoTrack.getSettings().deviceId || 'unknown',
      label: videoTrack.label || 'Camera',
      capabilities: videoTrack.getCapabilities()
    };
  }

  // Switch between front and back camera
  async switchCamera(): Promise<HTMLVideoElement> {
    const currentFacingMode = this.getCurrentFacingMode();
    const newFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
    
    this.stopCamera();
    
    return await this.initializeCamera({
      preferredCamera: newFacingMode,
      resolution: 'medium',
      frameRate: 30
    });
  }

  private getCurrentFacingMode(): 'environment' | 'user' {
    if (!this.stream) return 'environment';
    
    const videoTrack = this.stream.getVideoTracks()[0];
    const settings = videoTrack?.getSettings();
    
    return settings?.facingMode === 'user' ? 'user' : 'environment';
  }

  // Capture frame for TensorFlow.js processing
  captureFrame(): ImageData | null {
    if (!this.videoElement) return null;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) return null;

    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
    
    context.drawImage(this.videoElement, 0, 0);
    
    return context.getImageData(0, 0, canvas.width, canvas.height);
  }

  // Check if camera is currently active
  isActive(): boolean {
    return this.stream !== null && this.stream.active;
  }

  // Stop camera and clean up resources
  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
      });
      this.stream = null;
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement = null;
    }
  }

  // Get video element for AR.js integration
  getVideoElement(): HTMLVideoElement | null {
    return this.videoElement;
  }

  // Get stream for direct access
  getStream(): MediaStream | null {
    return this.stream;
  }
}

// Utility functions for camera permissions and detection
export class CameraUtils {
  // Check if getUserMedia is supported
  static isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  // Check camera permissions
  static async checkPermissions(): Promise<'granted' | 'denied' | 'prompt'> {
    if (!navigator.permissions) {
      return 'prompt'; // Fallback for browsers without permissions API
    }

    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return result.state;
    } catch (error) {
      console.warn('Permission check failed:', error);
      return 'prompt';
    }
  }

  // List available cameras
  static async getAvailableCameras(): Promise<MediaDeviceInfo[]> {
    if (!navigator.mediaDevices?.enumerateDevices) {
      return [];
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'videoinput');
    } catch (error) {
      console.error('Failed to enumerate cameras:', error);
      return [];
    }
  }

  // Check if device has multiple cameras
  static async hasMultipleCameras(): Promise<boolean> {
    const cameras = await this.getAvailableCameras();
    return cameras.length > 1;
  }

  // Detect if running on mobile device
  static isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Get optimal camera configuration for current device
  static getOptimalConfig(): CameraConfig {
    const isMobile = this.isMobileDevice();
    
    return {
      preferredCamera: 'environment', // Always prefer back camera for AR
      resolution: isMobile ? 'medium' : 'high',
      frameRate: isMobile ? 15 : 30 // Lower framerate on mobile to save battery
    };
  }
}

// React hook for easy camera integration
export function useCamera() {
  const [cameraManager] = useState(() => new CameraManager());
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async (config?: CameraConfig) => {
    try {
      setError(null);
      const optimalConfig = config || CameraUtils.getOptimalConfig();
      await cameraManager.initializeCamera(optimalConfig);
      setIsActive(true);
      return cameraManager.getVideoElement();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Camera initialization failed';
      setError(errorMessage);
      setIsActive(false);
      throw err;
    }
  };

  const stopCamera = () => {
    cameraManager.stopCamera();
    setIsActive(false);
    setError(null);
  };

  const switchCamera = async () => {
    try {
      setError(null);
      await cameraManager.switchCamera();
      setIsActive(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Camera switch failed';
      setError(errorMessage);
    }
  };

  return {
    cameraManager,
    isActive,
    error,
    startCamera,
    stopCamera,
    switchCamera,
    isSupported: CameraUtils.isSupported(),
    isMobile: CameraUtils.isMobileDevice()
  };
}