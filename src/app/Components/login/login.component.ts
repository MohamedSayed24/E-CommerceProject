import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Core/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginData: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required])
  });

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLoginSubmit(): void {
    if (this.loginData.valid) {
      this.authService.login(this.loginData.value).subscribe({
        next: (response) => {
          // Success: Token stored, now redirect the user to a protected page
          this.router.navigate(['/blank']);
        },
        error: (err) => {
          // Failure: Display error message from the backend
          this.errorMessage = err.error.message || 'Login failed. Check your credentials.';
        },
      });
    }
  }
}
