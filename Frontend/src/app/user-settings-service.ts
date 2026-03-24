import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private apiBase = 'http://127.0.0.1:8000/api';

  private getBasePath(): string {
    const currentUser = this.authService.currentUser();

    if (currentUser?.type === 'towUser') {
      return `${this.apiBase}/towusers`;
    }

    return `${this.apiBase}/users`;
  }

  updateUsername(userId: number, username: string) {
    return this.http.put(`${this.getBasePath()}/${userId}`, {
      username: username
    });
  }

  updatePassword(userId: number, password: string) {
    return this.http.put(`${this.getBasePath()}/${userId}`, {
      password: password
    });
  }

  updatePricePerKm(userId: number, pricePerKm: number) {
    return this.http.put(`${this.apiBase}/towusers/${userId}`, {
      price_per_km: pricePerKm
    });
  }

  deleteUser(userId: number) {
    return this.http.delete(`${this.getBasePath()}/${userId}`);
  }
}