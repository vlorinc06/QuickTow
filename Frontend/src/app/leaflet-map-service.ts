import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TowUser } from './models/towuser.model';
import { TowRequest } from './models/towrequest.model';

@Injectable({
  providedIn: 'root',
})
export class LeafletMapService {
  constructor(private http: HttpClient) { }

  getAddress(lat: number, lng: number): Observable<any> {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

    return this.http.get<any>(apiUrl);
  }

  searchStreet(street: string): Observable<any> {
    const query = encodeURIComponent(street);
    const apiUrl = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

    return this.http.get<any>(apiUrl)
  }

  popupHtml(user: TowUser) {
  return `
    <div class="tow-popup-card d-flex align-items-center p-3 rounded-4">
      <div class="me-3 text-center">
        <img src="assets/images/truck.png" alt="truck" style="width: 60px;">
        <div class="fw-bold mt-2">${user.price_per_km ?? '-'} Ft / Km</div>
      </div>

      <div class="flex-grow-1">
        <h5 class="mb-0 fw-bold">${user.last_name ?? ''} ${user.first_name ?? ''}</h5>
        <div class="text-muted small">${user.username ?? ''}</div>
        </div>
      </div>

      <div class="text-center">
        <div class="small mb-2"><i class="bi bi-geo-alt"></i> ~${user.distance} km-re</div>
        <button type="button" class="btn btn-dark btn-sm rounded-pill px-3 tow-request-btn" data-id="${user.id}">
          Vontatás kérése <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  `;
}

  popupTowRequestHtml(request: TowRequest) {
    const vehicleHtml = request.vehicle
      ? `<div class="d-flex align-items-center gap-2 mt-1 min-w-0">
         <i class="bi bi-car-front-fill text-secondary"></i>
         <div class="small text-break">
           ${request.vehicle.brand} ${request.vehicle.model}
           ${request.vehicle.license_plate ? `<span class="text-muted">(${request.vehicle.license_plate})</span>` : ''}
         </div>
       </div>`
      : '';

    return `
    <div class="tow-popup-container p-1" style="min-width: 250px;">
      <div class="d-flex flex-row align-items-center gap-3 mb-3">
        <!-- Left Side: Icon and Price -->
        <div class="text-center flex-shrink-0">
          <img src="assets/images/truck.png" alt="truck" style="width: 60px; height: auto;">
          <div class="fw-bold mt-1 text-dark">${request.price ? request.price + ' Ft' : '-'}</div>
        </div>

        <!-- Middle: User Info -->
        <div class="flex-grow-1 min-w-0">
          <h6 class="mb-0 fw-bold text-break">
            ${request.user?.last_name ?? ''} ${request.user?.first_name ?? ''}
          </h6>
          <div class="text-muted small text-break mb-1">
            @${request.user?.username ?? 'ismeretlen'}
          </div>
          <div class="d-flex align-items-center gap-2 mt-1">
            <i class="bi bi-telephone-fill text-success small"></i>
            <div class="fw-semibold small">${request.user?.phone_number ?? '-'}</div>
          </div>
          ${vehicleHtml}
        </div>
      </div>

      <!-- Actions -->
      <div class="d-flex gap-2 border-top pt-2">
        <button class="btn btn-danger text-light btn-sm rounded-pill px-3 flex-grow-1 tow-deny-btn">
          Elutasítás
        </button>
        <button class="btn btn-success text-light btn-sm rounded-pill px-3 flex-grow-1 tow-accept-btn">
          Elfogadás
        </button>
      </div>
    </div>
  `;
  }


}
