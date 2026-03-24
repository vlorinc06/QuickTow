import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class Auth {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

login(username: string, password: string, towuser: boolean): Observable<any> {
  let endpoint = '';

  if (towuser) {
    endpoint = `${this.apiUrl}/towusers/login`;
  } else {
    endpoint = `${this.apiUrl}/users/login`;
  }

  return this.http.post(endpoint, { username, password });
}

}