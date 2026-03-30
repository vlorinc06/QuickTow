import { Component, computed, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { UserSettingsComp, AlertPayload } from '../user-settings-comp/user-settings-comp';
import { TowRequestService } from '../tow-request-service';
import { RatingService } from '../rating-service';

type MenuTab =
  | 'settings'
  | 'activeRequests'
  | 'incomingRequests'
  | 'completedRequests'
  | 'reviews';

@Component({
  selector: 'app-profile-panel-comp',
  standalone: true,
  imports: [CommonModule, UserSettingsComp],
  templateUrl: './profile-panel-comp.html',
  styleUrl: './profile-panel-comp.css',
})
export class ProfilePanelComp {
  private authService = inject(AuthService);
  private router = inject(Router);
  private towRequestService = inject(TowRequestService);
  private ratingService = inject(RatingService);

  @Output() close = new EventEmitter<void>();

  currentUser = this.authService.currentUser;
  isTowUser = this.authService.isTowUser;

  activeTab = signal<MenuTab>('settings');

  activeRequests = signal<any[]>([]);
  completedRequests = signal<any[]>([]);
  reviews = signal<any[]>([]);

  messageTitle = '';
  messageText = '';
  messageType: 'success' | 'error' | 'warning' | 'info' = 'info';
  isMessageOpen = false;

  constructor() {
    if (this.isTowUser()) {
      this.activeTab.set('completedRequests');
      this.loadCompletedRequests();
    } else {
      this.activeTab.set('activeRequests');
      this.loadActiveRequests();
    }
  }

  fullName = computed(() => {
    const user = this.currentUser();
    const lastName = user?.last_name ?? 'Vezetéknév';
    const firstName = user?.first_name ?? 'Keresztnév';
    return `${lastName} ${firstName}`.trim();
  });

  username = computed(() => this.currentUser()?.username ?? 'Felhasználónév');

  selectTab(tab: MenuTab) {
    this.activeTab.set(tab);

    if (tab === 'activeRequests') {
      this.loadActiveRequests();
    }

    if (tab === 'completedRequests') {
      this.loadCompletedRequests();
    }

    if (tab === 'reviews') {
      this.loadReviews();
    }
  }

  openMessage(
    title: string,
    text: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) {
    this.messageTitle = title;
    this.messageText = text;
    this.messageType = type;
    this.isMessageOpen = true;
  }

  closeMessage() {
    this.isMessageOpen = false;
  }

  handleSettingsAlert(payload: AlertPayload) {
    this.openMessage(payload.title, payload.text, payload.type);
  }

  loadActiveRequests() {
    const userId = this.currentUser()?.id;
    if (!userId || this.isTowUser()) return;

    this.towRequestService.getTowRequestsByUser(userId)
      .subscribe((data: any[]) => {
        this.activeRequests.set(data);
      });
  }

  loadCompletedRequests() {
    const userId = this.currentUser()?.id;
    if (!userId || !this.isTowUser()) return;

    this.towRequestService.getTowRequestsByTowUser(userId)
      .subscribe((data: any[]) => {
        const filtered = data.filter(r => r.status === 'completed');
        this.completedRequests.set(filtered);
      });
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  loadReviews() {
    const userId = this.currentUser()?.id;
    if (!userId) return;

    if (this.isTowUser()) {
      this.ratingService.getRatingsByTowUser(userId)
        .subscribe((data: any[]) => {
          this.reviews.set(data);
        });
    } else {
      this.ratingService.getRatingsByUser(userId)
        .subscribe((data: any[]) => {
          this.reviews.set(data);
        });
    }
  }

  logout() {
    this.authService.logout();
    this.close.emit();
    this.router.navigate(['/']);
  }
}