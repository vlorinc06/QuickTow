import { Component, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TowRequestService } from '../tow-request-service';
import { TowRequest } from '../models/towrequest.model';
import { NgClass } from '@angular/common';
import { SubmitRatingWindow } from '../submit-rating-window/submit-rating-window';

@Component({
  selector: 'app-tow-request-end-window',
  imports: [NgClass],
  templateUrl: './tow-request-end-window.html',
  styleUrl: './tow-request-end-window.css',
})
export class TowRequestEndWindow {
  request!: TowRequest;
  isTowUser: boolean = false;
  userConfirmed = signal<boolean>(false)
  towUserConfirmed = signal<boolean>(false)
  ratingSent = signal<boolean>(false)
  loading = signal<boolean>(false)
  intervalId: any;

  constructor(
    private dialogRef: MatDialogRef<TowRequestEndWindow>,
    private dialog: MatDialog,
    private towRequestService: TowRequestService
  ) { }

  ngOnInit() {
    this.pollRequest();
    this.intervalId = setInterval(() => {
      this.pollRequest();
    }, 5000);
  }

  pollRequest() {
    if (this.request.id) {
      this.towRequestService.getTowRequestById(this.request.id).subscribe({
        next: (request) => {
          if (request.user_confirmed === 1) {
            this.userConfirmed.set(true)
            console.log('interval set userConfirmed to true')
          }
          if (request.tow_user_confirmed === 1) {
            this.towUserConfirmed.set(true);
            console.log('interval set towUserConfirmed to true')
          }
          if (this.towUserConfirmed() && this.userConfirmed()) {
            const updatedRequest = {
              status: 'completed'
            };

            if (!this.request?.id) return;

            this.towRequestService.updateTowRequest(this.request.id, updatedRequest).subscribe()
          }
          this.request = request
        }
      })
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  confirmEndAndPayment() {
    if (!this.request?.id) return;

    this.loading.set(true);

    let updatedRequest: Partial<TowRequest>;

    if (this.isTowUser) {
      updatedRequest = {
        tow_user_confirmed: 1
      };
      this.towUserConfirmed.set(true);
      console.log('tow user confirmed')
    }
    else {
      updatedRequest = {
        user_confirmed: 1
      };
      this.userConfirmed.set(true);
      console.log('user confirmed')
    }

    this.towRequestService.updateTowRequest(this.request.id, updatedRequest).subscribe({
      next: () => {
        this.loading.set(false);

        if (this.towUserConfirmed() && this.userConfirmed()) {
          updatedRequest = {
            status: 'completed',
            tow_user_confirmed: 1,
            user_confirmed: 1
          };

          if (!this.request?.id) return;

          this.towRequestService.updateTowRequest(this.request.id, updatedRequest).subscribe({
            next: () => {
              console.log("status set to complete")
            }
          })
        }
      },
      error: (err) => {
        console.log(err);
        this.loading.set(false);
      }
    });


  }

  getBottomText(): string {
    if (this.userConfirmed() && this.towUserConfirmed()) {
      return 'Bezárás';
    }

    if (this.isTowUser) {
      return 'Várakozás a felhasználó megerősítésére';
    }

    return 'Várakozás az autómentő megerősítésére';
  }

  openRatingDialog() {
    const dialogeRef = this.dialog.open(SubmitRatingWindow, {
      width: '540px',
      maxWidth: '90vw',
      disableClose: true
    });

    dialogeRef.componentInstance.towUserFirstName = this.request.tow_user.first_name;
    dialogeRef.componentInstance.towUserLastName = this.request.tow_user.last_name;
    dialogeRef.componentInstance.towUserUsername = this.request.tow_user.username;
    if(this.request.tow_user.id && this.request.id){
      dialogeRef.componentInstance.towUserId = this.request.tow_user.id;
      dialogeRef.componentInstance.towRequestId = this.request.id;
    }

    
    
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
