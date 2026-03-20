import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { VehicleService } from '../vehicle-service';
import { AuthService } from '../auth-service';
import { Vehicle } from '../models/vehicle.model';
import { NgClass } from '@angular/common';
import { LeafletMapService } from '../leaflet-map-service';
import * as L from 'leaflet';
import { UserService } from '../user-service';
import { TowUserService } from '../tow-user-service';
import { TowRequest, TowRequestPost } from '../models/towrequest.model';
import { TowRequestService } from '../tow-request-service';


@Component({
  selector: 'app-tow-request-window',
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, FormsModule, NgClass],
  templateUrl: './tow-request-window.html',
  styleUrl: './tow-request-window.css',
})
export class TowRequestWindow {
  pickupAddress!: string
  dropoffAddress!: string
  isAddingCar = false;
  car!: Vehicle;
  private routeControl?: L.Routing.Control
  selectedTowUser = signal<number | null>(null);
  towUserLat = signal<number | null>(null);
  towUserLng = signal<number | null>(null);
  towUserPrice = signal<number | null>(null);
  fullPrice = signal<number | null>(null);

  constructor(
    private dialogeRef: MatDialogRef<TowRequestWindow>,
    public vehicles: VehicleService,
    private auth: AuthService,
    private map: LeafletMapService,
    private user: UserService,
    private towUser: TowUserService,
    private towRequests: TowRequestService) {
    this.car = {
      brand: '',
      model: '',
      license_plate: '',
      user: this.auth.currentUser()!.id
    }
  }

  ngAfterViewInit() {
    const user = this.auth.currentUser()
    const towUser = this.towUser.selectedTowUser();

    if (user?.id != null) {
      this.vehicles.getVehicles(user.id)
    }

    if (towUser) {
      this.towUser.getTowUserById(towUser).subscribe({
        next: (res) => {
          if (res.latitude != null && res.longitude != null) {
            this.towUserLat.set(res.latitude)
            this.towUserLng.set(res.longitude)
          }
          if (res.id != null) {
            this.selectedTowUser.set(res.id)
          }
          this.towUserPrice.set(res.price_per_km)
        }
      })
    }

  }

  closeDialog() {
    this.dialogeRef.close()
  }

  deleteCar(id: number) {
    const user = this.auth.currentUser()
    this.vehicles.deleteVehicle(id).subscribe({
      next: () => {
        this.vehicles.getVehicles(user!.id)
      }
    });

  }

  selectCar(id: number) {
    const selected = this.vehicles.selectedId

    if (selected === id) {
      this.vehicles.selectedId = undefined
    }
    else {
      this.vehicles.selectedId = id;
    }

    console.log("selected car: ", this.vehicles.selected)
  }

  startAddingCar() {
    this.isAddingCar = true;
  }

  cancelAddingCar() {
    this.isAddingCar = false;
    this.car = {
      brand: '',
      model: '',
      license_plate: '',
      user: this.auth.currentUser()!.id
    }
  }

  saveCar() {
    if (!this.car.brand || !this.car.model || !this.car.license_plate) {
      return;
    }

    this.vehicles.addVehicle(this.car).subscribe({
      next: (vehicle) => {
        console.log("Jármű hozzáadva:", vehicle)

        this.vehicles.getVehicles(this.auth.currentUser()!.id);
      }
    })
  }

  userLat!: number;
  userLng!: number;
  distance = signal<number | null>(null);
  waypoints: any;
  dropoffLat!: number;
  dropoffLng!: number

  searchStreet() {
    if (!this.dropoffAddress) {
      return
    }

    this.map.searchStreet(this.dropoffAddress).subscribe({
      next: (res) => {

        if (this.routeControl) {

          this.routeControl = undefined;
        }

        if (this.user.userLocationLat != null && this.user.userLocationLng != null) {
          this.userLat = this.user.userLocationLat
          this.userLng = this.user.userLocationLng
        }

        const dropoffLat = parseFloat(res[0].lat);
        const dropoffLng = parseFloat(res[0].lon);

        this.dropoffLat = dropoffLat;
        this.dropoffLng = dropoffLng;

        console.log("felhasznalo:", this.user.userLocationLat, this.user.userLocationLng)

        const towLat = this.towUserLat();
        const towLng = this.towUserLng();

        if (towLat != null && towLng != null) {
          this.waypoints = [
            L.Routing.waypoint(L.latLng(towLat, towLng)),
            L.Routing.waypoint(L.latLng(this.userLat, this.userLng)),
            L.Routing.waypoint(L.latLng(dropoffLat, dropoffLng))
          ]
        }

        const router = L.Routing.osrmv1();
        router.route(this.waypoints, ((err: any, routes: any) => {
          if (routes && routes.length > 0) {
            const distance = Math.round(routes[0].summary.totalDistance / 1000);
            this.distance.set(distance)
            const towUserPrice = this.towUserPrice()

            if (distance != null && towUserPrice != null) {
              this.fullPrice.set(distance * towUserPrice);
            }
          }
          else if (err) {
            console.error("routing error", err);
          }
        }) as any)
      },
      error: () => {
        console.log("cim nem talalhato");
      }
    })

  }

  towRequest!: TowRequestPost;

  sendRequest() {
    const selectedTowUser = this.selectedTowUser()
    const fullPrice = this.fullPrice();
    if (selectedTowUser && this.user.userLocationLat && this.user.userLocationLng && fullPrice && this.vehicles.selectedId) {
      this.towRequest = {
        user: this.auth.currentUser()!.id,
        vehicle: this.vehicles.selectedId,
        tow_user: selectedTowUser,
        pickup_lat: this.user.userLocationLat,
        pickup_long: this.user.userLocationLng,
        pickup_note: this.pickupAddress,
        dropoff_lat: this.dropoffLat,
        dropoff_long: this.dropoffLng,
        status: "awaiting response",
        price: fullPrice
      }
    }

    this.towRequests.addTowRequest(this.towRequest).subscribe({
      next: () => {
        this.auth.isRequesting.set(true);

        const selectedId = this.towUser.selectedTowUser();
        if (selectedId != null) {
          this.towUser.selectedTowUser.set(selectedId); 
        }

        this.closeDialog()
      }
    })

  }

}
