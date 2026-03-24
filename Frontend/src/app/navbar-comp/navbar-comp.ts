import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { RegistryComp } from '../registry-comp/registry-comp';
import { LoginComp } from '../login-comp/login-comp';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-navbar-comp',
  standalone: true,
  imports: [CommonModule, FormsModule, RegistryComp, LoginComp],
  templateUrl: './navbar-comp.html',
  styleUrl: './navbar-comp.css',
})
export class NavbarComp {

  private authService = inject(AuthService);
  private router = inject(Router);

  isRegisterOpen = false;
  isLoginOpen = false;

  isLoggedIn = this.authService.isLoggedIn;
  currentUser = this.authService.currentUser;

  username = computed(() =>
    this.currentUser()?.username ?? 'Felhasználónév'
  );

  openRegister() {
    this.isLoginOpen = false;
    this.isRegisterOpen = true;
  }

  closeRegister() {
    this.isRegisterOpen = false;
  }

  openLogin() {
    this.isRegisterOpen = false;
    this.isLoginOpen = true;
  }

  closeLogin() {
    this.isLoginOpen = false;
  }

  openProfile() {
    this.isRegisterOpen = false;
    this.isLoginOpen = false;

    this.router.navigate(['/profile']);
  }

  openHome() {
    this.isRegisterOpen = false;
    this.isLoginOpen = false;

    this.router.navigate(['/']);
  }
}