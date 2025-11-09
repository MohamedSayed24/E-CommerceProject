import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PasswordResetService {
  // SessionStorage keys
  private readonly EMAIL_KEY = 'reset_email';
  private readonly CODE_VERIFIED_KEY = 'code_verified';
  private readonly TIMESTAMP_KEY = 'reset_timestamp';

  // Expiration time: 10 minutes (in milliseconds)
  private readonly EXPIRATION_TIME = 10 * 60 * 1000;

  constructor() {
    // Check for expired data on service initialization
    this.checkExpiration();
  }

  /**
   * Store the email for password reset flow
   */
  setEmail(email: string): void {
    sessionStorage.setItem(this.EMAIL_KEY, email);
    // Set timestamp when flow starts
    sessionStorage.setItem(this.TIMESTAMP_KEY, Date.now().toString());
  }

  /**
   * Retrieve the stored email
   * Returns null if expired or not found
   */
  getEmail(): string | null {
    if (this.isExpired()) {
      this.clearResetData();
      return null;
    }
    return sessionStorage.getItem(this.EMAIL_KEY);
  }

  /**
   * Mark that the reset code has been successfully verified
   */
  setCodeVerified(verified: boolean): void {
    sessionStorage.setItem(this.CODE_VERIFIED_KEY, verified.toString());
  }

  /**
   * Check if the reset code has been verified
   */
  isCodeVerified(): boolean {
    if (this.isExpired()) {
      this.clearResetData();
      return false;
    }
   sessionStorage.setItem(this.CODE_VERIFIED_KEY,'true');
   return true;
  }

  /**
   * Check if the reset flow has expired (15 minutes)
   */
  private isExpired(): boolean {
    const timestamp = sessionStorage.getItem(this.TIMESTAMP_KEY);
    if (!timestamp) {
      return true;
    }

    const startTime = parseInt(timestamp, 10);
    const currentTime = Date.now();
    
    return (currentTime - startTime) > this.EXPIRATION_TIME;
  }

  /**
   * Check expiration and clear data if expired
   */
  private checkExpiration(): void {
    if (this.isExpired()) {
      this.clearResetData();
    }
  }

  /**
   * Get remaining time in minutes before expiration
   */
  getRemainingTime(): number {
    const timestamp = sessionStorage.getItem(this.TIMESTAMP_KEY);
    if (!timestamp) {
      return 0;
    }

    const startTime = parseInt(timestamp, 10);
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const remaining = this.EXPIRATION_TIME - elapsed;

    return Math.max(0, Math.ceil(remaining / 60000)); // Convert to minutes
  }

  /**
   * Clear all password reset data from sessionStorage
   * Call this after successful password reset or on expiration
   */
  clearResetData(): void {
    sessionStorage.removeItem(this.EMAIL_KEY);
    sessionStorage.removeItem(this.CODE_VERIFIED_KEY);
    sessionStorage.removeItem(this.TIMESTAMP_KEY);
  }

  /**
   * Check if there's an active reset flow
   */
  hasActiveFlow(): boolean {
    return !this.isExpired() && this.getEmail() !== null;
  }
}
