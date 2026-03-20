import { Component, Input, signal, Signal } from '@angular/core';
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
  deniedRequest = signal<TowRequest |null>(null);
  private destroy = new Subject<void>();

  constructor(private requestWindow: MatDialog, private towUser: TowUserService, public auth: AuthService, private towRequest: TowRequestService) { }

  ngOnInit() {
    const userId = this.auth.currentUser()?.id;
    const userType = this.auth.currentUser()?.type;
    if (!userId) return;

    if(userType === "user"){
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
        const awaiting = res.filter(request => request.status === 'awaiting response');
        this.towRequests.set(awaiting);
        console.log(this.towRequests())
      }
    })

  }

  openDialog(id: number) {
    this.towUser.selectedTowUser.set(id)
    const dialogRef = this.requestWindow.open(TowRequestWindow, {
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
  if (!userId) return;
  
  this.towRequest.getTowRequestsByUser(userId).subscribe({
    next: (res: TowRequest[]) => {

      const active = res.find(r =>
        r.status === 'awaiting response' || r.status === 'in progress'
      );

      const denied = res.find(r => r.status === 'denied');

      this.towRequests.set(active ? [active] : []);
      this.auth.isRequesting.set(!!active);
      this.requestDenied.set(!active && !!denied);
      this.deniedRequest.set(denied ?? null)
    }
  });

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

  dismissDeniedRequest(){
    const request = this.deniedRequest();
    if(!request?.id) return;

    this.towRequest.updateTowRequest(request.id!,{
      ...request,
      status: 'dismissed'
    }).subscribe(()=>{
      this.requestDenied.set(false);
      this.auth.isRequesting.set(false);
      this.checkRequests();
    })
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

}
