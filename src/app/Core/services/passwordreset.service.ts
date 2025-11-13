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

  setEmail(email: string): void {
    sessionStorage.setItem(this.EMAIL_KEY, email);
    // Set timestamp when flow starts
    sessionStorage.setItem(this.TIMESTAMP_KEY, Date.now().toString());
  }

  getEmail(): string | null {
    if (this.isExpired()) {
      this.clearResetData();
      return null;
    }
    return sessionStorage.getItem(this.EMAIL_KEY);
  }

  setCodeVerified(verified: boolean): void {
    sessionStorage.setItem(this.CODE_VERIFIED_KEY, verified.toString());
  }

  isCodeVerified(): boolean {
    if (this.isExpired()) {
      this.clearResetData();
      return false;
    }
    sessionStorage.setItem(this.CODE_VERIFIED_KEY, 'true');
    return true;
  }

  private isExpired(): boolean {
    const timestamp = sessionStorage.getItem(this.TIMESTAMP_KEY);
    if (!timestamp) {
      return true;
    }

    const startTime = parseInt(timestamp, 10);
    const currentTime = Date.now();

    return currentTime - startTime > this.EXPIRATION_TIME;
  }

  private checkExpiration(): void {
    if (this.isExpired()) {
      this.clearResetData();
    }
  }

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

  clearResetData(): void {
    sessionStorage.removeItem(this.EMAIL_KEY);
    sessionStorage.removeItem(this.CODE_VERIFIED_KEY);
    sessionStorage.removeItem(this.TIMESTAMP_KEY);
  }

  hasActiveFlow(): boolean {
    return !this.isExpired() && this.getEmail() !== null;
  }
}
