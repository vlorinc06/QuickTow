import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer-comp',
  standalone: true,
  templateUrl: './footer-comp.html',
  styleUrl: './footer-comp.css',
})
export class FooterComp {
  constructor(private router: Router) {}

  openAbout() {
    this.router.navigate(['/about']);
  }
}