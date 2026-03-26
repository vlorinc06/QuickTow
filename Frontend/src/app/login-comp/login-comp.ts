import { Component, EventEmitter, Output, Inject, inject } from '@angular/core';
import { Auth } from '../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, AuthUser } from '../auth-service';
import { TowUserService } from '../tow-user-service';

@Component({
  selector: 'app-login-comp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-comp.html',
  styleUrl: './login-comp.css',
})
export class LoginComp {
  private authService = inject(AuthService);

  username = '';
  password = '';
  towuser = false;

  loggedUser: any = null;

  @Output() close = new EventEmitter<void>();

  constructor(
    @Inject(Auth) private auth: Auth,
    private towUserService: TowUserService
  ) { }

  closeModel() {
    this.close.emit();
  }

  login() {
    this.auth.login(this.username, this.password, this.towuser).subscribe({
      next: (res: any) => {
        const user = res.user;

        this.loggedUser = user;

        const authUser: AuthUser = {
          id: user.id,
          type: this.towuser ? 'towUser' : 'user',
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone_number: user.phone_number,
        };

        this.authService.setUser(authUser);

        if (authUser.type == "towUser") {
          this.towUserService.updateTowUser(authUser.id, {
            status: "available"
          }).subscribe()
        }


        alert('Sikeres bejelentkezés');
        this.closeModel();
      },
      error: (err) => {
        if (err.status === 404) {
          alert('Nem található ilyen felhasználó.');
        } else if (err.status === 401) {
          alert('Hibás jelszó.');
        } else {
          alert('Ismeretlen hiba történt.');
        }
      },
    });
  }
}