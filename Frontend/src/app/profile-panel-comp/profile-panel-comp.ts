import { Component, computed, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { UserSettingsComp } from '../user-settings-comp/user-settings-comp';

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

  @Output() close = new EventEmitter<void>();

  currentUser = this.authService.currentUser;
  isTowUser = this.authService.isTowUser;

  activeTab = signal<MenuTab>('settings');

  constructor() {
    if (this.isTowUser()) {
      this.activeTab.set('incomingRequests');
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
  }

  logout() {
    this.authService.logout();
    this.close.emit();
    this.router.navigate(['/']);
  }
}