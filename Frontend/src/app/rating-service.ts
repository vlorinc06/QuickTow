import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rating } from './models/rating.model';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor(private http: HttpClient) { }

  getRatingsByUser(id: number){
    const apiUrl = `http://127.0.0.1:8000/api/ratings/user/${id}`

    this.http.get<Rating>(apiUrl);
  }

  getRatingsByTowUser(id: number){
    const apiUrl = `http://127.0.0.1:8000/api/ratings/tow_user/${id}`

    this.http.get<Rating>(apiUrl);
  }

  addRating(rating: Rating){
    const apiUrl = `http://127.0.0.1:8000/api/ratings`;

    this.http.post<Rating>(apiUrl,rating);
  }

  deleteRating(id: number){
    const apiUrl = `http://127.0.0.1:8000/api/ratings/${id}`;

    this.http.delete<Rating>(apiUrl)
  }
}
