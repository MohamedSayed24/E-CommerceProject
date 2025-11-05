// In reset-password.component.ts

import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { PasswordResetService } from "../../services/passwordreset.service";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector:'app-reset-password',
  standalone:true,
  imports:[FormsModule],
  templateUrl:'./reset-password.component.html',
  
})
  


export class ResetPasswordComponent {
  // Assuming these are bound via [(ngModel)] in the template
  newPassword: string = ''; 
  
  constructor(
    private authService: AuthService, 
    private passwordResetService: PasswordResetService,
    private router: Router
  ) {}

  onResetSubmit(): void {
    // 1. Get the email from the service (needed for the API call)
    const email = this.passwordResetService.getEmail();

    if (!email || !this.passwordResetService.isCodeVerified()) {
      // Security check: ensure email is present and code was verified
      this.router.navigate(['/forgot-password']);
      return;
    }

    // 2. Call the service function
    this.authService.resetPassword(email, this.newPassword).subscribe({
      next: (response) => {
        // 3. Success: Clear data and navigate to login
        this.passwordResetService.clearResetData();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // 4. Handle API error (e.g., password too weak, server error)
        console.error('Password reset failed:', err);
        // Display error message to user...
      }
    });
  }
}