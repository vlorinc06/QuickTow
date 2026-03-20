import { Component, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComp } from './navbar-comp/navbar-comp';
import { FooterComp } from './footer-comp/footer-comp';
import { AuthService, AuthUser } from './auth-service';
import { TowRequest } from './models/towrequest.model';
import { TowRequestService } from './tow-request-service';
import { LocationTrackingService } from './location-tracking-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComp, FooterComp],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Frontend');

  towRequests: TowRequest[] = [];

  user: AuthUser ={
    id: 8,
    type: 'towUser'
  }

  constructor (private auth: AuthService, private towRequest: TowRequestService, private locationTracking: LocationTrackingService){
    effect(() => {
      const currentUser = this.auth.currentUser();

      if (currentUser?.type === 'towUser') {
        this.locationTracking.startTowUserLocationUpdates();
      } else {
        this.locationTracking.stopTowUserLocationUpdates();
      }
    });
  }

}