import { CommonModule, NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Rating, RatingPost } from '../models/rating.model';
import { AuthService } from '../auth-service';
import { RatingService } from '../rating-service';

@Component({
  selector: 'app-submit-rating-window',
  imports: [CommonModule, FormsModule, MatDialogModule, NgClass],
  templateUrl: './submit-rating-window.html',
  styleUrl: './submit-rating-window.css',
})
export class SubmitRatingWindow {
  towUserFirstName!: string;
  towUserLastName!: string;
  towUserUsername!: string;
  towUserId!: number;
  towRequestId!: number;

  selectedStars = signal<number>(0);
  hoverStars = signal<number>(0);
  reviewText = '';
  loading = signal(false);

  constructor(
    private dialogRef: MatDialogRef<SubmitRatingWindow>,
    private auth: AuthService,
    private ratingService: RatingService
  ) { }

  setRating(stars: number) {
    this.selectedStars.set(stars);
  }

  setHover(stars: number) {
    this.hoverStars.set(stars);
  }

  clearHover() {
    this.hoverStars.set(0);
  }

  isStarActive(star: number): boolean {
    const hover = this.hoverStars();
    const selected = this.selectedStars();
    return hover > 0 ? star <= hover : star <= selected;
  }

  submitRating() {
    if (this.selectedStars() === 0) return;

    const user = this.auth.currentUser()?.id
    if(!user) return;

    this.loading.set(true);

    const ratingData : RatingPost = {
      user: user,
      tow_user: this.towUserId,
      tow_request: this.towRequestId,
      rating: this.selectedStars(),
      text: this.reviewText.trim() || undefined
    };

    this.ratingService.addRating(ratingData).subscribe({
      next: () =>{
        console.log("rating submitted");
      }
    })

    this.loading.set(false);
    this.dialogRef.close(ratingData);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

