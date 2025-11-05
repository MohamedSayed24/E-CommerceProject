import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLoginSubmit(): void {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        // Success: Token stored, now redirect the user to a protected page
        this.router.navigate(['/blank']);
      },
      error: (err) => {
        // Failure: Display error message from the backend
        this.errorMessage = 'Login failed. Check your credentials.';
      },
    });
  }
}
