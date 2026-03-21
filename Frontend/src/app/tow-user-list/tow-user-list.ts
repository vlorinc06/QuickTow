import { Component, computed, Input, signal, Signal } from '@angular/core';
import { TowUser } from '../models/towuser.model';
import { DecimalPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TowRequestWindow } from '../tow-request-window/tow-request-window';
import { TowUserService } from '../tow-user-service';
import { AuthService } from '../auth-service';
import { TowRequestService } from '../tow-request-service';
import { TowRequest, TowRequestPost } from '../models/towrequest.model';
import { DialogRef } from '@angular/cdk/dialog';
import { interval, pipe, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { TowRequestEndWindow } from '../tow-request-end-window/tow-request-end-window';
import { ViewRatingsWindow } from '../view-ratings-window/view-ratings-window';
import { RatingService } from '../rating-service';

@Component({
  selector: 'app-tow-user-list',
  imports: [DecimalPipe],
  templateUrl: './tow-user-list.html',
  styleUrl: './tow-user-list.css',
})
export class TowUserList {
  @Input() towUsersIn: TowUser[] = [];

  towUsers: TowUser[] = [];
  towRequests = signal<TowRequest[]>([])
  activeUserRequest = signal<TowRequest | null>(null);
  requestDenied = signal<boolean>(false);
  deniedRequest = signal<TowRequest | null>(null);
  userConfirming: boolean = false;
  towUserConfirming: boolean = false;
  towUserRatings = signal<{ [towUserId: number]: any[] }>({});

  private destroy = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private towUser: TowUserService,
    public auth: AuthService,
    private towRequest: TowRequestService,
    private ratingService: RatingService
  ) { }

  ngOnInit() {
    const userId = this.auth.currentUser()?.id;
    const userType = this.auth.currentUser()?.type;
    if (!userId) return;

    if (userType === "user") {
      setInterval(() => {
        this.checkRequests();
      }, 5000);
    }

    if (this.auth.currentUser()?.type === "user") {
      this.checkRequests();
    }
    else if (this.auth.currentUser()?.type === "towUser") {
      this.startPollingRequests();
    }
  }

  ngOnChanges() {
    this.towUsers = this.towUsersIn;
    console.log(this.towUsers.length)
  }

  averageRatingStars(towUser: TowUser) {
    const rating = Math.round(towUser.rating);

    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }


  startPollingRequests() {
    const towUserId = this.auth.currentUser()?.id;
    if (!towUserId) return;

    interval(5000).pipe(
      startWith(0), switchMap(() => {
        console.log(`request id: ${towUserId}`)
        return this.towRequest.getTowRequestsByTowUser(towUserId)
      }), takeUntil(this.destroy)
    ).subscribe({
      next: (res: TowRequest[]) => {
        const inProgress = res.find(r => r.status === 'in progress');

        let requests: TowRequest[];

        const confirming = res.find(r => r.status === 'confirming')

        if (confirming && !this.towUserConfirming) {
          this.towUserConfirming = true;
          this.openEndDialog(confirming);
        }

        if (inProgress) {
          requests = [inProgress];
        } else {
          requests = res.filter(r => r.status === 'awaiting response');
        }
        this.towRequests.set(requests);
      }
    })

  }

  openDialog(id: number) {
    this.towUser.selectedTowUser.set(id)
    const dialogRef = this.dialog.open(TowRequestWindow, {
      width: '1000px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(() => {
      this.checkRequests();
    })

  }

  checkRequests() {
    const userId = this.auth.currentUser()?.id;
    const userType = this.auth.currentUser()?.type;
    if (!userId) return;

    if (userType === "user") {
      this.towRequest.getTowRequestsByUser(userId).subscribe({
        next: (res: TowRequest[]) => {

          const active = res.find(r =>
            r.status === 'awaiting response' || r.status === 'in progress'
          );

          const denied = res.find(r => r.status === 'denied');

          const confirming = res.find(r => r.status === 'confirming')


          if (confirming && !this.userConfirming) {
            this.userConfirming = true;
            this.openEndDialog(confirming);
          }

          if (!confirming) {
            this.userConfirming = false; 
          }

          if(active?.tow_user.id){
            this.loadTowUserRatings(active.tow_user.id)
          }

          this.towRequests.set(active ? [active] : []);
          this.auth.isRequesting.set(!!active);
          this.requestDenied.set(!active && !!denied);
          this.deniedRequest.set(denied ?? null)
        }
      });
    }
    else if (userType === "towUser") {
      this.towRequest.getTowRequestsByTowUser(userId).subscribe({
        next: (res: TowRequest[]) => {

          const active = res.find(r =>
            r.status === 'awaiting response' || r.status === 'in progress'
          );

          const denied = res.find(r => r.status === 'denied');

          const confirming = res.find(r => r.status === 'confirming')

          if (confirming) {
            if (this.towUserConfirming === false)
              this.openEndDialog(confirming)
            this.towUserConfirming = true
          }

          this.towRequests.set(active ? [active] : []);
        }
      });
    }


  }

  cancelRequest(id: number, request: TowRequest) {
    const updated = {
      ...request,
      status: 'cancelled'
    }

    this.towRequest.updateTowRequest(id, updated).subscribe({
      next: (res) => {
        this.checkRequests()
      }
    })

  }

  denyRequest(id: number, request: TowRequest) {
    const updated = {
      ...request,
      status: 'denied'
    }

    this.towRequest.updateTowRequest(id, updated).subscribe({
      next: (res) => {
        this.checkRequests()
      }
    })
  }

  acceptRequest(id: number, request: TowRequest) {
    const updated = {
      ...request,
      status: 'in progress'
    }

    this.towRequest.updateTowRequest(id, updated).subscribe()

  }

  dismissDeniedRequest() {
    const request = this.deniedRequest();
    if (!request?.id) return;

    this.towRequest.updateTowRequest(request.id!, {
      ...request,
      status: 'dismissed'
    }).subscribe(() => {
      this.requestDenied.set(false);
      this.auth.isRequesting.set(false);
      this.checkRequests();
    })
  }

  completeRequest(id: number, request: TowRequest) {
    const updated = {
      ...request,
      status: 'confirming'
    }

    this.towRequest.updateTowRequest(id, updated).subscribe(() => {
      this.towUserConfirming = true
      this.openEndDialog(request)
    });

  }

  openEndDialog(request: TowRequest) {
    const userType = this.auth.currentUser()?.type;
    const dialogRef = this.dialog.open(TowRequestEndWindow, {
      width: '820px',
      maxWidth: '95vw',
      disableClose: true
    })

    dialogRef.componentInstance.request = request;
    dialogRef.componentInstance.isTowUser = userType === "user" ? false : true;
  }

  openRatings(towUserId: number) {
    const dialogRef = this.dialog.open(ViewRatingsWindow, {
      width: '820px',
      maxWidth: '95vw',
      disableClose: false
    })

    dialogRef.componentInstance.selectedTowUser = towUserId;

  }

  loadTowUserRatings(towUserId: number) {
    this.ratingService.getRatingsByTowUser(towUserId).subscribe({
      next: (ratings) => {
        this.towUserRatings.update(current => ({
          ...current,
          [towUserId]: ratings
        }));
      }
    });
  }

  getTowUserRatings(towUserId: number) {
    return this.towUserRatings()[towUserId] || [];
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

}
