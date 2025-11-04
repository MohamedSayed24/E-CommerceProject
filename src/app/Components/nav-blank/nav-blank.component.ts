import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.css',
})
export class NavBlankComponent {
  constructor(private authService: AuthService, private router: Router) {}
  SignOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
