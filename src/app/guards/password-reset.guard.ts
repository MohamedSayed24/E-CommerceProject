import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PasswordResetService } from '../Core/services/passwordreset.service';

@Injectable({
  providedIn: 'root',
})
export class PasswordResetGuard implements CanActivate {
  constructor(
    private passwordResetService: PasswordResetService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // 1️⃣ Check if there's an active flow
    if (!this.passwordResetService.hasActiveFlow()) {
      this.router.navigate(['/forgot-password']);
      return false;
    }

    // 2️⃣ Check if code is verified (for /reset-password only)
    const currentUrl = this.router.url;
    if (currentUrl.includes('reset-password') && !this.passwordResetService.isCodeVerified()) {
      this.router.navigate(['/verify-code']);
      return false;
    }

    return true;
  }
}
