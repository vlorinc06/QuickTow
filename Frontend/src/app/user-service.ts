import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) { }

  userLocationLat?: number;
  userLocationLng?: number

  user = signal<User | null>(null);

  getUser(id: number) {
    const apiUrl = `http://127.0.0.1:8000/api/users/id/${id}`

    return this.http.get<User>(apiUrl);
  }

  addUser(user: User) {
    const apiUrl = `http://127.0.0.1:8000/api/towusers`

    return this.http.post<User>(apiUrl, user);
  }

  updateUser(id: number, user: User,) {
    const apiUrl = `http://127.0.0.1:8000/api/towusers/${id}`

    return this.http.put<User>(apiUrl, user);
  }

  deleteUser(id: number) {
    const apiUrl = `http://127.0.0.1:8000/api/towusers/${id}`

    return this.http.delete<User>(apiUrl);
  }

  

}
