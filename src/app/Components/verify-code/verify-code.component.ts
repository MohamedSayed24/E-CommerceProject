import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PasswordResetService } from '../../services/passwordreset.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './verify-code.component.html'

})
export class VerifyCodeComponent {
  code: string = '';
  errorMessage: string = ''; // For displaying API errors
  
  constructor(private _authService:AuthService,
    private _passwordreset:PasswordResetService,
    private _router:Router){};

  onSubmit(){
    const email = this._passwordreset.getEmail();
    if (!email) {
        this.errorMessage = 'Reset flow expired or missing email.';
        this._router.navigate(['/forgot-password']);
        return;
    }

  // 2. Call the API
    this._authService.verifyResetCode(this.code,email).subscribe({
      next: (response) => {
        // --- CORRECTED SUCCESS LOGIC ---
        // 3. Update the state in the service
        this._passwordreset.setCodeVerified(true);
        
        // 4. Navigate to the final step
        this._router.navigate(['/reset-password']);
      },
      error: (err) => {
        // --- ERROR HANDLING ---
        // 5. Display the error to the user
        // Assuming API sends an error property like err.error.message
        this.errorMessage = err.error?.message || 'Invalid code. Please try again.';
        // Optional: Do NOT clear data here, allow user to retry code.
        }
      });
    
  
    }
  }
