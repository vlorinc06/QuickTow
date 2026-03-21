import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rating, RatingPost } from './models/rating.model';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor(private http: HttpClient) { }

  getRatingsByUser(id: number){
    const apiUrl = `http://127.0.0.1:8000/api/ratings/getby/user/${id}`

    return this.http.get<Rating[]>(apiUrl);
  }

  getRatingsByTowUser(id: number){
    const apiUrl = `http://127.0.0.1:8000/api/ratings/getby/tow_user/${id}`

    return this.http.get<Rating[]>(apiUrl);
  }

  addRating(rating: RatingPost){
    const apiUrl = `http://127.0.0.1:8000/api/ratings`;

    return this.http.post<Rating>(apiUrl,rating);
  }

  deleteRating(id: number){
    const apiUrl = `http://127.0.0.1:8000/api/ratings/${id}`;

    return this.http.delete<Rating>(apiUrl)
  }
}
