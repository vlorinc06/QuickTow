import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth-service';
import { UserService } from '../user-service';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertPayload {
  title: string;
  text: string;
  type: AlertType;
}

@Component({
  selector: 'app-user-settings-comp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-settings-comp.html',
  styleUrls: ['./user-settings-comp.css'],
})
export class UserSettingsComp implements OnInit {
  @Output() showAlert = new EventEmitter<AlertPayload>();

  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  pricePerKm: number | null = null;

  isSaving = false;

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

  private alert(title: string, text: string, type: AlertType = 'info') {
    this.showAlert.emit({ title, text, type });
  }

  saveUsername() {
    const user = this.authService.currentUser();
    if (!user) return;

    if (!this.username.trim()) {
      this.alert('Hiba', 'A felhasználónév nem lehet üres', 'warning');
      return;
    }

    this.isSaving = true;

    const request =
      user.type === 'towUser'
        ? this.userService.updateUsernameForTowUser(user.id, this.username)
        : this.userService.updateUsernameForUser(user.id, this.username);

    request.subscribe({
      next: () => {
        this.authService.updateUsername(this.username);
        this.alert('Siker', 'Felhasználónév frissítve', 'success');
        this.isSaving = false;
      },
      error: () => {
        this.alert('Hiba', 'Hiba történt a frissítés során', 'error');
        this.isSaving = false;
      },
    });
  }

  savePassword() {
    const user = this.authService.currentUser();
    if (!user) return;

    if (!this.password || this.password.length < 6) {
      this.alert('Hiba', 'A jelszó minimum hossza 6 karakter.', 'warning');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.alert('Hiba', 'A jelszavak nem egyeznek.', 'warning');
      return;
    }

    this.isSaving = true;

    const request =
      user.type === 'towUser'
        ? this.userService.updatePasswordForTowUser(user.id, this.password)
        : this.userService.updatePasswordForUser(user.id, this.password);

    request.subscribe({
      next: () => {
        this.alert('Siker', 'Jelszó frissítve', 'success');
        this.password = '';
        this.confirmPassword = '';
        this.isSaving = false;
      },
      error: () => {
        this.alert('Hiba', 'Hiba történt', 'error');
        this.isSaving = false;
      },
    });
  }

  savePricePerKm() {
    const user = this.authService.currentUser();
    if (!user || user.type !== 'towUser') return;

    if (!this.pricePerKm || this.pricePerKm <= 0) {
      this.alert('Hiba', 'Adj meg érvényes árat', 'warning');
      return;
    }

    this.isSaving = true;

    this.userService.updatePricePerKm(user.id, this.pricePerKm).subscribe({
      next: () => {
        this.authService.updatePricePerKm(this.pricePerKm!);
        this.alert('Siker', 'Ár frissítve', 'success');
        this.isSaving = false;
      },
      error: () => {
        this.alert('Hiba', 'Hiba történt', 'error');
        this.isSaving = false;
      },
    });
  }

  deleteAccount() {
    const user = this.authService.currentUser();
    if (!user) return;

    this.alert(
      'Figyelem',
      'Biztosan törölni akarod? Ez nem visszavonható.',
      'warning'
    );
  }
}