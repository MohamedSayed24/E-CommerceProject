import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notfound',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink
  ],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.css'
})
export class NotfoundComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/blank/home']);
  }

  goBack(): void {
    window.history.back();
  }
}
