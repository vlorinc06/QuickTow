import { Component, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar-comp',
  imports: [CommonModule,FormsModule],
  templateUrl: './navbar-comp.html',
  standalone: true, 
  styleUrl: './navbar-comp.css',
})
export class NavbarComp {
  isModelOpen = false;

  openModel() {
    this.isModelOpen = true;
  }

  closeModel() {
    this.isModelOpen = false;
  }
}
