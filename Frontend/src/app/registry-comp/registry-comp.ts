import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registry-comp',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registry-comp.html',
  styleUrl: './registry-comp.css',
})
export class RegistryComp {
  @Output() close = new EventEmitter<void>();

  selectedType: 'none' | 'user' | 'tow' = 'none';

  last_name = '';
  first_name = '';
  username = '';
  password = '';
  email = '';
  phone_number = '';
  priceperkm: number | null = null;

  messageTitle = '';
  messageText = '';
  messageType: 'success' | 'error' | 'warning' | 'info' = 'info';
  isMessageOpen = false;

  private apiBase = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  closeModel() {
    this.close.emit();
  }

  registerAsUser() {
    this.selectedType = 'user';
  }

  registerAsTow() {
    this.selectedType = 'tow';
  }

  back() {
    this.selectedType = 'none';
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

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private validateForm(): boolean {
    if (!this.last_name.trim()) {
      this.openMessage('Hiányzó adat', 'Add meg a vezetéknevet.', 'warning');
      return false;
    }

    if (!this.first_name.trim()) {
      this.openMessage('Hiányzó adat', 'Add meg a keresztnevet.', 'warning');
      return false;
    }

    if (!this.username.trim()) {
      this.openMessage('Hiányzó adat', 'Add meg a felhasználónevet.', 'warning');
      return false;
    }

    if (!this.password.trim()) {
      this.openMessage('Hiányzó adat', 'Add meg a jelszót.', 'warning');
      return false;
    }

    if (this.password.trim().length < 6) {
      this.openMessage('Érvénytelen jelszó', 'A jelszónak legalább 6 karakter hosszúnak kell lennie.', 'warning');
      return false;
    }

    if (!this.email.trim()) {
      this.openMessage('Hiányzó adat', 'Add meg az email címet.', 'warning');
      return false;
    }

    if (!this.isValidEmail(this.email.trim())) {
      this.openMessage('Érvénytelen email', 'Adj meg egy valós email címet.', 'warning');
      return false;
    }

    if (!this.phone_number.trim()) {
      this.openMessage('Hiányzó adat', 'Add meg a telefonszámot.', 'warning');
      return false;
    }

    if (this.selectedType === 'tow' && (this.priceperkm === null || this.priceperkm <= 0)) {
      this.openMessage('Hiányzó adat', 'Add meg az Ár / km értéket.', 'warning');
      return false;
    }
    this.openMessage('Sikeres regisztráció', 'Sikeresen létrehoztad a fiókot, most már be tudsz jelentkezni!','success');
    return true;
  }

  register() {
    if (!this.validateForm()) {
      return;
    }

    const payload: any = {
      last_name: this.last_name.trim(),
      first_name: this.first_name.trim(),
      username: this.username.trim(),
      password: this.password,
      email: this.email.trim(),
      phone_number: this.phone_number.trim(),
    };

    if (this.selectedType === 'tow') {
      payload.price_per_km = this.priceperkm;
    }

    const url =
      this.selectedType === 'tow'
        ? `${this.apiBase}/towusers`
        : `${this.apiBase}/users`;

    this.http.post(url, payload).subscribe({
      next: () => {
        this.openMessage(
          'Sikeres regisztráció',
          'A regisztráció sikeresen megtörtént.',
          'success'
        );

        setTimeout(() => {
          this.closeMessage();
          this.closeModel();
        }, 1800);
      },
      error: (err) => {
        let errorText = 'Ismeretlen hiba történt a regisztráció közben.';

        if (err?.error?.message) {
          errorText = err.error.message;
        } else if (err?.status === 422) {
          errorText = 'Valamelyik megadott adat hibás vagy már használatban van.';
        } else if (err?.status) {
          errorText = `Hiba regisztráció közben. Státuszkód: ${err.status}`;
        }

        this.openMessage('Sikertelen regisztráció', errorText, 'error');
      },
    });
  }
}