import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TowRequest, TowRequestPost } from './models/towrequest.model';

@Injectable({
  providedIn: 'root',
})
export class TowRequestService {
  constructor(private http: HttpClient) { }

  getTowRequestById(id: number){
    const apiUrl = `http://127.0.0.1:8000/api/towrequests/id/${id}`

    return this.http.get<TowRequest>(apiUrl);
  }

  getTowRequestsByTowUser(id: number){
    const apiUrl = `http://127.0.0.1:8000/api/towrequests/getby/tow_user/${id}`

    return this.http.get<TowRequest[]>(apiUrl);
  }

  getTowRequestsByUser(id: number){
    const apiUrl = `http://127.0.0.1:8000/api/towrequests/getby/user/${id}`

    return this.http.get<TowRequest[]>(apiUrl);
  }
  
  addTowRequest(request: TowRequestPost){
    const apiUrl = `http://127.0.0.1:8000/api/towrequests`

    return this.http.post<TowRequestPost>(apiUrl,request);
  }

  updateTowRequest(id: number, request: TowRequest){
    const apiUrl = `http://127.0.0.1:8000/api/towrequests/${id}`

    return this.http.put<TowRequest>(apiUrl, request);
  }
}
