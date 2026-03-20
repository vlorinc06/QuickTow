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

  searchStreet(street:string): Observable<any> {
    const query = encodeURIComponent(street);
    const apiUrl = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

    return this.http.get<any>(apiUrl)
  }

  popupHtml(user: TowUser)
  {
    return`
      <div class="tow-popup-card d-flex align-items-center p-3 rounded-4">
        <div class="me-3 text-center">
          <img src="assets/images/truck.png" alt="truck" style="width: 60px;">
          <div class="fw-bold mt-2">${user.price_per_km ?? '-'} Ft / Km</div>
        </div>

        <div class="flex-grow-1">
          <h5 class="mb-0 fw-bold">${user.last_name ?? ''} ${user.first_name ?? ''}</h5>
          <div class="text-muted small">${user.username ?? ''}</div>

          <div class="my-1">
            <a href="#" class="small text-decoration-underline text-dark tow-reviews-link">
              Értékelések
            </a>
          </div>
        </div>

        <div class="text-center">
          <div class="small mb-2"><i class="bi bi-geo-alt"></i> ~${user.distance} km-re</div>
          <button class="btn btn-dark btn-sm rounded-pill px-3 tow-request-btn">
            Vontatás kérése <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    `
  }

  popupTowRequestHtml(request: TowRequest) {
  return `
    <div class="tow-popup-card p-3 rounded-4">
      <h5 class="mb-2 fw-bold">Tow request #${request.id}</h5>

      <div class="small text-muted mb-2">
        ${request.pickup_note ?? 'No pickup note'}
      </div>

      <div class="mb-2">
        <strong>Price:</strong> ${request.price ?? '-'} Ft
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-outline-dark btn-sm tow-route-btn" data-id="${request.id}">
          Route
        </button>

        <button class="btn btn-success btn-sm tow-accept-btn" data-id="${request.id}">
          Accept
        </button>

        <button class="btn btn-danger btn-sm tow-deny-btn" data-id="${request.id}">
          Deny
        </button>
      </div>
    </div>
  `;
}


}
