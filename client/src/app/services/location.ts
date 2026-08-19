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

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
