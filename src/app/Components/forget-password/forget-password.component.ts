import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PasswordResetService } from '../../services/passwordreset.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [FormsModule],
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
