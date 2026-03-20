import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { TowUser } from './models/towuser.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TowUserService {
  constructor(private http: HttpClient) { }

  towUser!: TowUser;
  towUsers: TowUser[] = [];

  selectedTowUser= signal<number | null>(null);

  getTowUsers(lat: number, lng: number, radius: number): Observable<any> {
    const apiUrl = `http://127.0.0.1:8000/api/towusers/radius/?lat=${lat}&long=${lng}&radius=${radius}`

    return this.http.get<TowUser[]>(apiUrl);
  }

  getTowUserById(id: number) {
    const apiUrl = `http://127.0.0.1:8000/api/towusers/id/${id}`

    return this.http.get<TowUser>(apiUrl);
  }

  getMinRating(rating: number) {
    const apiUrl = `http://127.0.0.1:8000/api/towusers/minrating/${rating}`

    return this.http.get<TowUser[]>(apiUrl);
  }

  addTowUser(user: TowUser) {
    const apiUrl = `http://127.0.0.1:8000/api/towusers`

    return this.http.post<TowUser>(apiUrl, user);
  }

  updateTowUser(id: number, user: TowUser) {
    const apiUrl = `http://127.0.0.1:8000/api/towusers/${id}`

    return this.http.put<TowUser>(apiUrl, user);
  }

  deleteTowUser(id: number) {
    const apiUrl = `http://127.0.0.1:8000/api/towusers/${id}`

    return this.http.delete<TowUser>(apiUrl);
  }
}
