import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComp } from '../navbar-comp/navbar-comp';
import { FooterComp } from '../footer-comp/footer-comp';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-comp',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './about-comp.html',
  styleUrl: './about-comp.css',
})
export class AboutComp {}