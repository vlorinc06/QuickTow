import { Injectable, signal } from '@angular/core';
import { TowUserService } from './tow-user-service';
import { AuthService } from './auth-service';
import { TowUser } from './models/towuser.model';

@Injectable({
  providedIn: 'root',
})
export class LocationTrackingService {
  private locationIntervalId: any;
  currentLocation = signal<{ lat: number, lng: number } | null>(null);
  private fallbackLocation = {
    lat: 48.2389,
    lng: 20.2971
  }

  constructor(
    private towUserService: TowUserService,
    private authService: AuthService
  ) { }


  startTowUserLocationUpdates() {

    if (this.locationIntervalId) {
      clearInterval(this.locationIntervalId);
    }

    this.updateTowUserLocation();

    this.locationIntervalId = setInterval(() => {
      this.updateTowUserLocation();
    }, 30000)

  }

  updateTowUserLocation() {
    const towUserId = this.authService.currentUser()?.id;

    if (!towUserId) {
      console.error('Missing tow user data');
      return;
    }

    if (!navigator.geolocation) {

    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        this.currentLocation.set({ lat, lng });

        console.log('Tow user location:', lat, lng)

        this.towUserService.updateTowUser(towUserId, { latitude: lat, longitude: lng } as TowUser).subscribe({
          next: (res) => {
            console.log('Location updated', res);
          },
        });
      },
      (error) => {
        console.warn('Failed to get location', error)
        const lat = this.fallbackLocation.lat;
        const lng = this.fallbackLocation.lng;
        this.currentLocation.set({ lat, lng })
        console.log('fallback location',lat,lng)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }

    )
  }

  stopTowUserLocationUpdates() {
    if (this.locationIntervalId) {
      clearInterval(this.locationIntervalId);
      this.locationIntervalId = null;
    }
  }

}
