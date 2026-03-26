import { computed, Injectable, signal } from '@angular/core';
import { UserService } from './user-service';
import { TowUserService } from './tow-user-service';

export interface AuthUser {
  id: number;
  type: 'user' | 'towUser';
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  price_per_km?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<AuthUser | null>(null);

  isLoggedIn = computed(() => this.currentUser() !== null);
  isTowUser = computed(() => this.currentUser()?.type === 'towUser');
  isRegularUser = computed(() => this.currentUser()?.type === 'user');

  isRequesting = signal<boolean>(false);

  constructor(
    private userService: UserService,
    private towUserService: TowUserService
  ) {
    const saved = localStorage.getItem('authUser');
    if (saved) {
      const parsed = JSON.parse(saved) as AuthUser;
      this.setUser(parsed);
    }
  }

  setUser(user: AuthUser | null) {
    this.currentUser.set(user);

    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('authUser');
    }

    if (user?.type === 'user') {
      this.userService.getUser(user.id).subscribe({
        next: (res) => {
          this.userService.user.set(res);
        },
      });
    }
  }

  updateUsername(username: string) {
    const user = this.currentUser();
    if (!user) return;

    const updatedUser: AuthUser = {
      ...user,
      username,
    };

    this.currentUser.set(updatedUser);
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
  }

  updatePricePerKm(price_per_km: number) {
    const user = this.currentUser();
    if (!user) return;

    const updatedUser: AuthUser = {
      ...user,
      price_per_km,
    };

    this.currentUser.set(updatedUser);
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
  }

  logout() {
    const userId = this.currentUser()?.id
    if(this.currentUser()?.type == "towUser" && userId)
    {
      this.towUserService.updateTowUser(userId, {
        status: "offline"
      }).subscribe()
    }
    this.currentUser.set(null);
    localStorage.removeItem('authUser');
  }
}