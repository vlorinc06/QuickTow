import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth-service';
import { UserService } from '../user-service';

@Component({
  selector: 'app-user-settings-comp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-settings-comp.html',
  styleUrls: ['./user-settings-comp.css'],
})
export class UserSettingsComp implements OnInit {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  pricePerKm: number | null = null;

  isSaving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    public authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.username = user.username ?? '';
    this.pricePerKm = user.price_per_km ?? null;
  }

  saveUsername() {
    const user = this.authService.currentUser();
    if (!user) return;

    if (!this.username.trim()) {
      alert('A felhasználónév nem lehet üres');
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request =
      user.type === 'towUser'
        ? this.userService.updateUsernameForTowUser(user.id, this.username)
        : this.userService.updateUsernameForUser(user.id, this.username);

    request.subscribe({
      next: () => {
        this.authService.updateUsername(this.username);
        alert('Felhasználónév frissítve');
        this.isSaving = false;
      },
      error: () => {
        alert('Hiba történt a frissítés során');
        this.isSaving = false;
      },
    });
  }

  savePassword() {
    const user = this.authService.currentUser();

    if (!user) return;

    if (!this.password || this.password.length < 6) {
      alert('A jelszónak legalább 6 karakternek kell lennie');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('A jelszavak nem egyeznek');
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request =
      user.type === 'towUser'
        ? this.userService.updatePasswordForTowUser(user.id, this.password)
        : this.userService.updatePasswordForUser(user.id, this.password)

    request.subscribe({
      next: () => {
        alert('jelszó frissítve');
        this.password = '';
        this.confirmPassword = '';
        this.isSaving = false;
      },
      error: () => {
        alert('Hiba történt a jelszó frissítése során');
        this.isSaving = false;
      },
    });
  }

  savePricePerKm() {
    const user = this.authService.currentUser();
    if (!user || user.type !== 'towUser') return;

    if (this.pricePerKm == null || this.pricePerKm <= 0) {
      this.errorMessage = 'Adj meg érvényes árat';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.updatePricePerKm(user.id, this.pricePerKm).subscribe({
      next: () => {
        this.authService.updatePricePerKm(this.pricePerKm!);
        this.successMessage = 'Ár frissítve';
        this.isSaving = false;
      },
      error: () => {
        this.errorMessage = 'Hiba történt az ár frissítése során';
        this.isSaving = false;
      },
    });
  }

  deleteAccount() {
    const user = this.authService.currentUser();
    if (!user) return;

    const confirmed = confirm(
      'Biztosan törölni szeretnéd a fiókodat? Ez nem visszavonható.'
    );
    if (!confirmed) return;

    const request =
      user.type === 'towUser'
        ? this.userService.deleteTowUser(user.id)
        : this.userService.deleteRegularUser(user.id);

    request.subscribe({
      next: () => {
        this.authService.logout();
      },
      error: () => {
        this.errorMessage = 'Hiba történt a törlés során';
      },
    });
  }
}