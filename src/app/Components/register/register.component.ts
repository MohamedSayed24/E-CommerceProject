import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registeredData = {
    name: '',
    email: '',
    password: '',
    rePassword: '',
    phone: '',
  };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegisterSubmit(): void {
    this.authService.register(this.registeredData).subscribe({
      next: (response) => {
        // Success: Token stored, now redirect the user to a protected page
        this.router.navigate(['/blank']);
      },
      error: (err) => {
        // Failure: Display error message from the backend
        this.errorMessage =
          err.error.message || 'Login failed. Check your credentials.';
      },
    });
  }
}
