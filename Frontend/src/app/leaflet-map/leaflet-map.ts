import { HttpClient } from '@angular/common/http';
import { Component, effect, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { LeafletMapService } from '../leaflet-map-service';
import { TowUser } from '../models/towuser.model';
import { TowUserService } from '../tow-user-service';
import 'leaflet-routing-machine';
import { AuthService } from '../auth-service';
import { UserService } from '../user-service';
import { LocationTrackingService } from '../location-tracking-service';
import { C, F } from '@angular/cdk/keycodes';
import { TowRequestService } from '../tow-request-service';
import { TowRequest } from '../models/towrequest.model';
import { interval, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TowRequestWindow } from '../tow-request-window/tow-request-window';
import { ViewRatingsWindow } from '../view-ratings-window/view-ratings-window';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
  iconUrl: 'leaflet/images/marker-icon.png',
  shadowUrl: 'leaflet/images/marker-shadow.png',
});

@Component({
  selector: 'app-leaflet-map',
  imports: [FormsModule],
  templateUrl: './leaflet-map.html',
  styleUrl: './leaflet-map.css',
})

export class LeafletMap implements OnInit {
  private destroy = new Subject<void>();
  private map!: L.Map;
  private center: L.LatLngExpression = [48.2205, 20.2854];
  private userMarker?: L.Marker;
  private userCircle?: L.Circle;
  private towSelfMarker?: L.Marker;
  private pickupMarkers = new Map<number, L.Marker>();
  private dropoffMarkers = new Map<number, L.Marker>();

  street?: string;

  radius?: number;
  towUsers: TowUser[] = []
  towMarkers = new Map<number, L.Marker>();
  selectedTowUserId?: number;

  private routeControl?: L.Routing.Control

  private routedInProgressRequestId?: number;
  private inProgressRouteControl?: L.Routing.Control;

  @Output() towUsersOut = new EventEmitter<TowUser[]>();

  constructor(
    private mapService: LeafletMapService,
    private towUserService: TowUserService,
    private towRequestService: TowRequestService,
    public auth: AuthService,
    public user: UserService,
    private locationTracking: LocationTrackingService,
    private dialog: MatDialog,
    private ngZone: NgZone
  ) {
    effect(() => {
      const selectedId = this.towUserService.selectedTowUser();
      const isRequesting = this.auth.isRequesting();

      if (selectedId != null && this.towMarkers.has(selectedId)) {
        this.keepOnlySelectedMarker(selectedId);
        this.removePopupFromMarker(selectedId);
      }



    })

    effect(() => {
      const location = this.locationTracking.currentLocation();
      if (location && this.map) {
        this.updateSelfTowUserMarker(location.lat, location.lng)
      }
    })
  }

  private initMap() {
    this.map = L.map('map', {
      center: this.center,
      zoom: 10,
      zoomControl: false
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 8,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors (ODbL) - Routing by OSRM'
    });

    tiles.addTo(this.map)
  }

  ngOnInit() {
    this.initMap();

    const userId = this.auth.currentUser()?.id;
    const userType = this.auth.currentUser()?.type;
    if (!userId) return;

    if (userType === "user") {
      interval(5000).pipe(
        startWith(0),
        switchMap(() => this.towRequestService.getTowRequestsByUser(userId)),
        takeUntil(this.destroy)
      ).subscribe({
        next: (requests) => {
          // 1. Look for an active request
          const activeRequest = requests.find(
            r => r.status === 'awaiting response' || r.status === 'in progress'
          );

          // 2. If NO active request is found...
          if (!activeRequest) {
            // ONLY clear the map if we were previously tracking a specific selected tow user.
            // This allows markers from the "Search" button to stay on the map.
            if (this.towUserService.selectedTowUser() !== null) {
              this.towUserService.selectedTowUser.set(null);
              this.towMarkers.forEach(marker => this.map.removeLayer(marker));
              this.towMarkers.clear();
            }
          }
          // 3. If an active request IS found and it has a valid tow_user...
          else if (activeRequest.tow_user?.id) {
            // This fixes the "undefined" error: 
            // We already checked activeRequest and tow_user exist in the 'else if'
            this.towUserService.selectedTowUser.set(activeRequest.tow_user.id);

            this.loadSelectedTowUserMarker(
              activeRequest.tow_user.id,
              activeRequest.status
            );
          }

          // 4. Handle Route logic
          const inProgressRequest = requests.find(r => r.status === 'in progress');
          if (inProgressRequest) {
            if (this.routedInProgressRequestId !== inProgressRequest.id) {
              // this.drawInProgressRoute(inProgressRequest);
            }
          } else {
            this.clearInProgressRoute();
          }
        }
      });
    }
    else if (userType === "towUser") {
      const location = this.locationTracking.currentLocation();
      if (location) {
        this.updateSelfTowUserMarker(location.lat, location.lng);
      }
    }

    if (userType === "towUser") {
      interval(5000).pipe(
        startWith(0),
        switchMap(() => this.towRequestService.getTowRequestsByTowUser(userId)),
        takeUntil(this.destroy)
      ).subscribe({
        next: (requests) => {
          // --- ADDED THIS LINE ---
          // Filter to only show markers for active or pending requests
          const activeRequests = requests.filter(r => r.status === 'awaiting response' || r.status === 'in progress');
          this.loadTowRequestMarkers(activeRequests);
          // -----------------------

          const visibleRequests = requests.find(r => r.status === 'awaiting response' || r.status === 'in progress');

          if (!visibleRequests?.tow_user?.id) {
            if (this.towUserService.selectedTowUser() !== null) {
              this.towUserService.selectedTowUser.set(null);
              this.towMarkers.forEach(marker => this.map.removeLayer(marker));
              this.towMarkers.clear();
            }
            return;
          }

          this.towUserService.selectedTowUser.set(visibleRequests.tow_user.id);
          this.loadSelectedTowUserMarker(
            visibleRequests.tow_user.id,
            visibleRequests.status
          );

          const inProgressRequest = requests.find(r => r.status === 'in progress')
          if (inProgressRequest) {
            if (this.routedInProgressRequestId !== inProgressRequest.id) {
              //this.drawInProgressRoute(inProgressRequest);
            }
          } else {
            this.clearInProgressRoute();
          }
        }
      })
    }

  }

  getLocation() {
    if (!this.map) return;

    this.map.locate({
      setView: true,
      enableHighAccuracy: true
    })

    this.map.once('locationfound', (e: L.LocationEvent) => {
      const radius = e.accuracy;

      console.log(`location: ${e.latlng.lat}, ${e.latlng.lng}`);
      const { lat, lng } = e.latlng;
      this.getAddress(lat, lng);

      if (this.userMarker) {
        this.map.removeLayer(this.userMarker);
      }
      if (this.userCircle) {
        this.map.removeLayer(this.userCircle);
      }

      this.userMarker = L.marker(e.latlng).addTo(this.map).bindPopup('Ezen a területen belül vagy').openPopup();
      this.userCircle = L.circle(e.latlng, radius).addTo(this.map);
    })

    this.map.once('locationerror', (e) => {
      alert("Failed to get location: " + e.message)
    });
  }

  getAddress(lat: number, lng: number): void {
    this.mapService.getAddress(lat, lng).subscribe({
      next: (res) => {
        const address = res.display_name;
        console.log(`Address ${address}`)
      },
      error: () => {
        console.error('Failed to get address')
      }
    })
  }



  searchStreet() {
    if (this.street === undefined) return;

    this.mapService.searchStreet(this.street).subscribe({
      next: (res) => {
        if (res.length < 1) {
          console.log("Nem találtuk a keresett címet");
          return;
        }

        const lat = parseFloat(res[0].lat);
        const lng = parseFloat(res[0].lon);

        this.map.setView([lat, lng], 15);

        if (this.userMarker) {
          this.map.removeLayer(this.userMarker);
        }
        if (this.userCircle) {
          this.map.removeLayer(this.userCircle);
        }

        this.userMarker = L.marker([lat, lng]).addTo(this.map).bindPopup(res[0].display_name).openPopup();
      }
    })
  }

  towIcon = L.icon({
    iconUrl: '../../assets/images/truck.png',
    iconSize: [54, 27]
  })


  towIconPending = L.icon({
    iconUrl: '../../assets/images/truck_pending.png',
    iconSize: [54, 27]
  })

  towIconActive = L.icon({
    iconUrl: '../../assets/images/truck_active.png',
    iconSize: [54, 27]
  })

  towIconDenied = L.icon({
    iconUrl: '../../assets/images/truck_denied.png',
    iconSize: [54, 27]
  })

  pickupIcon = L.icon({
    iconUrl: '../../assets/images/car_icon_map.png',
    iconSize: [30, 22]
  })

  private getTowIconByStatus(status?: string): L.Icon {
    if (status === 'awaiting response') {
      return this.towIconPending;
    }

    if (status === 'in progress') {
      return this.towIconActive;
    }

    if (status === 'denied') {
      return this.towIconDenied;
    }

    return this.towIcon;
  }

  private createMarkerWithPopup(
    lat: number,
    lng: number,
    icon: L.Icon,
    getPopupHtml: () => string,
    getRouteTo: () => L.LatLngExpression | null,
    allowRouting: boolean = false,
    onPopupOpen?: (popupElement: HTMLElement) => void
  ): L.Marker {
    const marker = L.marker([lat, lng], { icon }).addTo(this.map);

    marker.bindPopup(getPopupHtml());

    marker.on('click', () => {
      marker.setPopupContent(getPopupHtml());
      marker.openPopup();

      if (!allowRouting) return;

      const routeTo = getRouteTo();
      if (!routeTo) return;

      if (this.routeControl) {
        this.map.removeControl(this.routeControl);
        this.routeControl = undefined;
      }

      const from = marker.getLatLng();
      const to = L.latLng(routeTo);

      const options: any = {
        waypoints: [L.latLng(from.lat, from.lng), to],
        addWaypoints: false,
        fitSelectedRoutes: false,
        show: false,
        showAlternatives: false,
        lineOptions: {
          extendToWaypoints: true,
          missingRouteTolerance: 0
        },
        createMarker: () => null
      };

      this.routeControl = L.routing.control(options).addTo(this.map);
    });

    marker.on('popupopen', () => {
      const popupElement = marker.getPopup()?.getElement();
      if (!popupElement) return;

      onPopupOpen?.(popupElement);
    });

    marker.on('popupclose', () => {
      if (this.routeControl) {
        this.map.removeControl(this.routeControl);
        this.routeControl = undefined;
      }
    });

    return marker;
  }

  search() {
    if (!this.userMarker) {
      console.error('Nincs felhasználói tartózkodási hely.');
      return;
    }
    if (!this.radius) {
      console.error('Nincs megadott sugár');
      return;
    }

    const lat = this.userMarker.getLatLng().lat;
    const lng = this.userMarker.getLatLng().lng;

    this.user.userLocationLat = lat;
    this.user.userLocationLng = lng;

    this.towUserService.getTowUsers(lat, lng, this.radius).subscribe({
      next: (users: TowUser[]) => {
        const validTowUsers = users.filter(
          (u: TowUser): u is TowUser & { latitude: number; longitude: number } => u.latitude !== undefined && u.longitude !== undefined
        );

        this.towUsers = validTowUsers;

        this.towMarkers.forEach(marker => {
          this.map.removeLayer(marker)
        })

        this.towMarkers.clear();

        validTowUsers.forEach(towUser => {
          const marker = this.createMarkerWithPopup(
            towUser.latitude,
            towUser.longitude,
            this.getTowIconByStatus(),
            () => this.mapService.popupHtml(towUser),
            () => this.userMarker?.getLatLng() ?? null,
            true,
            (popupElement) => {
              setTimeout(() => {
                const requestBtn = popupElement.querySelector('.tow-request-btn');

                requestBtn?.addEventListener('click', (e) => {
                  if (towUser.id != null) {
                    this.openDialog(towUser.id!);
                  }
                })


              }, 0)

            }
          );



          if (towUser.id != null) {
            this.towMarkers.set(towUser.id, marker);
          }
        });


        this.towUsersOut.emit(this.towUsers);
      }
    })
  }

  keepOnlySelectedMarker(towUserId: number) {
    this.selectedTowUserId = towUserId;

    this.towMarkers.forEach((marker, id) => {
      if (id !== towUserId) {
        this.map.removeLayer(marker);
      }
    })

    const selectedMarker = this.towMarkers.get(towUserId);
    this.towMarkers.clear();

    if (selectedMarker) {
      this.towMarkers.set(towUserId, selectedMarker)
    }
  }

  removePopupFromMarker(towUserId: number) {
    const marker = this.towMarkers.get(towUserId);

    if (marker) {
      marker.closePopup();
      marker.unbindPopup();
    }
  }

  updateSelfTowUserMarker(lat: number, lng: number) {
    const position: L.LatLngExpression = [lat, lng];

    if (this.towSelfMarker) {
      this.towSelfMarker.setLatLng(position);
    }
    else {
      this.towSelfMarker = L.marker(position).addTo(this.map)
    }
  }

  loadSelectedTowUserMarker(towUserId: number, requestStatus?: string) {
    const user = this.auth.currentUser()?.type
    if (user === "user") {
      this.towUserService.getTowUserById(towUserId).subscribe({
        next: (towUser) => {
          console.log("loaded tow user:", towUser);

          if (towUser.latitude == null || towUser.longitude == null) {
            return
          }

          this.towMarkers.forEach(marker => this.map.removeLayer(marker));
          this.towMarkers.clear();

          const marker = L.marker([towUser.latitude, towUser.longitude], { icon: this.getTowIconByStatus(requestStatus) }).addTo(this.map);

          this.towMarkers.set(towUserId, marker);
        }
      })
    }

  }

  clearRequestMarkers() {
    this.pickupMarkers.forEach(marker => this.map.removeLayer(marker))
    this.pickupMarkers.clear();

    this.dropoffMarkers.forEach(marker => this.map.removeLayer(marker));
    this.dropoffMarkers.clear();
  }

  loadTowRequestMarkers(requests: TowRequest[]) {
    const requestIds = new Set(requests.map(r => r.id));

    this.pickupMarkers.forEach((marker, id) => {
      if (!requestIds.has(id)) {
        this.map.removeLayer(marker);
        this.pickupMarkers.delete(id);
      }
    });

    requests.forEach(request => {
      if (
        request.id == null ||
        request.pickup_lat == null ||
        request.pickup_long == null ||
        this.pickupMarkers.has(request.id)
      ) {
        return;
      }

      const marker = this.createMarkerWithPopup(
        request.pickup_lat,
        request.pickup_long,
        this.pickupIcon,
        () => this.mapService.popupTowRequestHtml(request),
        () => {
          const currentLocation = this.locationTracking.currentLocation();
          return currentLocation
            ? L.latLng(currentLocation.lat, currentLocation.lng)
            : null;
        },
        false
        ,
        (popupElement) => {
          setTimeout(() => {
            const acceptBtn = popupElement.querySelector('.tow-accept-btn');
            const denyBtn = popupElement.querySelector('.tow-deny-btn');

            acceptBtn?.addEventListener('click', () => this.acceptRequestFromMap(request));
            denyBtn?.addEventListener('click', () => this.denyRequestFromMap(request));
          }, 0);

        }
      );

      this.pickupMarkers.set(request.id, marker);
    });
  }

  acceptRequestFromMap(request: TowRequest) {
    if (!request.id) return;

    const updated = {
      ...request,
      status: 'in progress'
    };

    this.towRequestService.updateTowRequest(request.id, updated).subscribe(() => {
      this.map.closePopup();
    });
  }

  denyRequestFromMap(request: TowRequest) {
    if (!request.id) return;

    const updated = {
      ...request,
      status: 'denied'
    };

    this.towRequestService.updateTowRequest(request.id, updated).subscribe(() => {
      this.map.closePopup();
    });
  }

  private drawInProgressRoute(request: TowRequest) {
    if (
      request.id == null ||
      request.pickup_lat == null ||
      request.pickup_long == null ||
      request.dropoff_lat == null ||
      request.dropoff_long == null
    ) {
      return;
    }

    const towUserLat = request.tow_user.latitude;
    const towUserLng = request.tow_user.longitude;

    if (towUserLat && towUserLng) {
      const options: any = {
        waypoints: [
          L.latLng(towUserLat, towUserLng),
          L.latLng(request.pickup_lat, request.pickup_long),
          L.latLng(request.dropoff_lat, request.dropoff_long)
        ],
        addWaypoints: false,
        fitSelectedRoutes: true,
        show: false,
        showAlternatives: false,
        lineOptions: {
          extendToWaypoints: true,
          missingRouteTolerance: 0
        },
        createMarker: () => null
      };

      this.inProgressRouteControl = L.routing.control(options).addTo(this.map);
      console.log("in progress route calculated")
      this.routedInProgressRequestId = request.id;
    }
  }

  private clearInProgressRoute() {
    if (this.inProgressRouteControl) {
      this.map.removeControl(this.inProgressRouteControl);
      this.inProgressRouteControl = undefined;
    }

    this.routedInProgressRequestId = undefined;
  }

  openDialog(id: number) {
    this.towUserService.selectedTowUser.set(id)
    const dialogRef = this.dialog.open(TowRequestWindow, {
      width: '1000px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true
    })
  }


  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

}
