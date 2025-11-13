import { Component } from '@angular/core';
import { AuthService } from '../../Core/services/auth.service';
import { PasswordResetService } from '../../Core/services/passwordreset.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './forget-password.component.html'
})
export class ForgetPasswordComponent {
  email:string = ''
  errorMessage: string = '';
constructor(
  private authService: AuthService,
  private passwordResetService: PasswordResetService,
  private router: Router
) {}

onSubmit() {
  this.authService.forgotPassword(this.email).subscribe({
    next: () => {
      this.passwordResetService.setEmail(this.email);
      this.router.navigate(['/verify-code']);
    },
    error: (err) => {
        
        this.errorMessage = err.error?.message || 'Invalid Email. Please try again.';
        
        }
  });
}
}
