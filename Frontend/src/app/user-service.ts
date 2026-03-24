import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  userLocationLat?: number;
  userLocationLng?: number;

  user = signal<User | null>(null);

  private apiUrl = 'http://127.0.0.1:8000/api';

  getUser(id: number) {
    return this.http.get<User>(`${this.apiUrl}/users/id/${id}`);
  }

  addUser(user: User) {
    return this.http.post<User>(`${this.apiUrl}/towusers`, user);
  }

  updateUser(id: number, user: User) {
    return this.http.put<User>(`${this.apiUrl}/towusers/${id}`, user);
  }

  deleteTowUser(id: number) {
    return this.http.delete(`${this.apiUrl}/towusers/${id}`);
  }

  updateUsernameForUser(userId: number, username: string) {
    return this.http.put(`${this.apiUrl}/users/${userId}`, {
      "username": username
    });
  }

  updateUsernameForTowUser(userId: number, username: string) {
    return this.http.put(`${this.apiUrl}/towusers/${userId}`, {
      "username": username
    });
  }

  updatePasswordForUser(userId: number, password: string) {
    return this.http.put(`${this.apiUrl}/users/${userId}`, {
      "password": password
    });
  }

  updatePasswordForTowUser(userId: number, password: string) {
    return this.http.put(`${this.apiUrl}/towusers/${userId}`, {
      "password": password
    });
  }

  updatePricePerKm(userId: number, pricePerKm: number) {
    return this.http.put(`${this.apiUrl}/towusers/${userId}`, {
      "price_per_km": pricePerKm,
    });
  }

  deleteRegularUser(userId: number) {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }
}