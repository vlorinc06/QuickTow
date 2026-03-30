import {
  Component,
  EventEmitter,
  Output,
  Inject,
  inject,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
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

  messageTitle = '';
  messageText = '';
  messageType: 'success' | 'error' | 'warning' | 'info' = 'info';
  isMessageOpen = false;

  @Output() close = new EventEmitter<void>();

  constructor(
    @Inject(Auth) private auth: Auth,
    private towUserService: TowUserService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  closeModel() {
    this.close.emit();
  }

  openMessage(
    title: string,
    text: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) {
    this.ngZone.run(() => {
      this.messageTitle = title;
      this.messageText = text;
      this.messageType = type;
      this.isMessageOpen = true;
      this.cdr.detectChanges();
    });
  }

  closeMessage() {
    this.ngZone.run(() => {
      this.isMessageOpen = false;
      this.cdr.detectChanges();
    });
  }

  private validateForm(): boolean {
    if (!this.username.trim()) {
      this.openMessage('Hiányzó adat', 'Add meg a felhasználónevet.', 'warning');
      return false;
    }

    if (!this.password.trim()) {
      this.openMessage('Hiányzó adat', 'Add meg a jelszót.', 'warning');
      return false;
    }

    return true;
  }

  login() {
    if (!this.validateForm()) {
      return;
    }

    this.auth.login(this.username.trim(), this.password, this.towuser).subscribe({
      next: (res: any) => {
        this.ngZone.run(() => {
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

          if (authUser.type === 'towUser') {
            this.towUserService.updateTowUser(authUser.id, {
              status: 'available',
            }).subscribe({
              next: () => {},
              error: () => {},
            });
          }

          this.openMessage(
            'Sikeres bejelentkezés',
            'Sikeresen bejelentkeztél.',
            'success'
          );

          setTimeout(() => {
            this.closeMessage();
            this.closeModel();
          }, 1800);

          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          if (err?.status === 404) {
            this.openMessage(
              'Sikertelen bejelentkezés',
              'Nem található ilyen felhasználó.',
              'error'
            );
          } else if (err?.status === 401) {
            this.openMessage(
              'Sikertelen bejelentkezés',
              'Hibás jelszó.',
              'error'
            );
          } else {
            this.openMessage(
              'Ismeretlen hiba',
              'Ismeretlen hiba történt.',
              'error'
            );
          }

          this.cdr.detectChanges();
        });
      },
    });
  }
}