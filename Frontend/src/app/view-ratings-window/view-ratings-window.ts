import { Component, computed, signal, Signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Rating } from '../models/rating.model';
import { RatingService } from '../rating-service';

@Component({
  selector: 'app-view-ratings-window',
  imports: [],
  templateUrl: './view-ratings-window.html',
  styleUrl: './view-ratings-window.css',
})
export class ViewRatingsWindow {
  selectedTowUser!: number;

  constructor(
    private dialogRef: MatDialogRef<ViewRatingsWindow>,
    private ratingsService: RatingService
  ){}

  ratings = signal<Rating[]>([])

  averageRatingStars = computed(()=>{
    const ratings = this.ratings();
    if(ratings.length === 0) return '☆☆☆☆☆'

    const rating = ratings[0].tow_user.rating;
    const rounded = Math.round(rating);

    return '★'.repeat(rounded) + '☆'.repeat(5-rounded)
    })

  ngOnInit(){
    this.ratingsService.getRatingsByTowUser(this.selectedTowUser).subscribe({
      next: (ratings) => {
        this.ratings.set(ratings);
      }
    })
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
