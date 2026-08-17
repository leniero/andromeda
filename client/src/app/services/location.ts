import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private userLocation: { latitude: number; longitude: number } | null = null;
  private locationPromise: Promise<{ latitude: number; longitude: number }> | null = null;

  constructor() {}

  /**
   * Prompts for location if not already fetched. 
   * Returns a promise that resolves with the coordinates.
   */
  async getLocation(): Promise<{ latitude: number; longitude: number }> {
    if (this.userLocation) {
      return this.userLocation;
    }

    if (this.locationPromise) {
      return this.locationPromise;
    }

    this.locationPromise = new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          resolve(this.userLocation);
        },
        (error) => {
          console.warn('Geolocation denied or failed. Using fallback.', error);
          // Fallback location if user denies permission so the app doesn't break
          this.userLocation = {
            latitude: 51.5074,
            longitude: -0.1278
          };
          resolve(this.userLocation);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });

    return this.locationPromise;
  }
}
