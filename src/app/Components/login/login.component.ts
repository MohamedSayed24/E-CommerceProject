import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Core/services/auth.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginData: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });

  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLoginSubmit(): void {
    if (this.loginData.valid) {
      this.authService.login(this.loginData.value).subscribe({
        next: (response) => {
          // Success: Token stored, now store user data and redirect
          if (response && response.user) {
            // User data is already stored in the auth service
            // But we can also manually store additional data if needed
            const userData = {
              name: response.user.name || '',
              email: this.loginData.value.email,
              role: response.user.role || 'user',
              id: response.user._id || response.user.id || '',
            };
            localStorage.setItem('userData', JSON.stringify(userData));
          }
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
}
