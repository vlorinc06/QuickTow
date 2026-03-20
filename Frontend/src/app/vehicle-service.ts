import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Vehicle } from './models/vehicle.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  vehicles = signal<Vehicle[]>([])
  selectedId?: number;

  selected = signal<Vehicle | null>(null);

  constructor(private http: HttpClient) { }

  getVehicles(userId: number) {
    const apiUrl = `http://127.0.0.1:8000/api/vehicles/user/${userId}`

    return this.http.get<Vehicle[]>(apiUrl).subscribe({
      next: data=> {
        this.vehicles.set(data),
        console.log(this.vehicles())
      }
    });
  }

  getVehicleById(id: number)
  {
    const apiUrl = `http://127.0.0.1:8000/api/vehicles/id/${id}`
    
    return this.http.get<Vehicle>(apiUrl)
  }

  addVehicle(vehicle: Vehicle)
  {
    const apiUrl = `http://127.0.0.1:8000/api/vehicles/`
    
    return this.http.post<Vehicle>(apiUrl,vehicle)
  }

  deleteVehicle(id: number) {
    const apiUrl = `http://127.0.0.1:8000/api/vehicles/${id}`

    return this.http.delete<Vehicle[]>(apiUrl);
  }
}
