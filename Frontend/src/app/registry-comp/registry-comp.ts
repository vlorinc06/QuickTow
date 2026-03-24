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

  // közös mezők
  last_name = '';
  first_name = '';
  username = '';
  password = '';
  email = '';
  phone_number = '';

  // tow extra mező
  priceperkm: number | null = null;

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

  register() {
    
    if (this.selectedType === 'tow' && (this.priceperkm === null || this.priceperkm <= 0)) {
      alert('Add meg az Ár / km értéket!');
      return;
    }

    const payload: any = {
      last_name: this.last_name,
      first_name: this.first_name,
      username: this.username,
      password: this.password,
      email: this.email,
      phone_number: this.phone_number,
    };

    if (this.selectedType === 'tow') {
      payload.price_per_km = this.priceperkm;
    }

    const url =
      this.selectedType === 'tow'
        ? `${this.apiBase}/towusers`
        : `${this.apiBase}/users`;

    console.log('REGISTER type:', this.selectedType);
    console.log('REGISTER url:', url);
    console.log('REGISTER payload:', payload);

    this.http.post(url, payload).subscribe({
      next: (res: any) => {
        console.log('REGISTER OK:', res);
        alert('Sikeres regisztráció!');
        this.closeModel();
      },
      error: (err) => {
        console.log('REGISTER ERROR:', err);
        alert(`Hiba regisztráció közben: ${err?.status ?? ''}`);
      },
    });
  }
}