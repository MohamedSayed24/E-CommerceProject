import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'https://ecommerce.routemisr.com/api/v1/auth';
  private readonly TOKEN_KEY = 'authToken';
  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    // The backend receives the credentials and, if successful, returns a JWT token.
    return this.http.post(`${this.API_URL}/signin`, credentials).pipe(
      // Use the tap operator to execute a side effect (token storage) without altering the stream
      tap((response: any) => {
        // Assuming the backend returns the token in a 'token' property
        if (response && response.token) {
          this.storeToken(response.token);
        }
      })
    );
  }

  /**
   * 2. Handles the Register API request.
   */
  register(userData: any): Observable<any> {
    // Note: Registration may or may not return a token.
    return this.http.post(`${this.API_URL}/signup`, userData).pipe(
      tap((response: any) => {
        // Assuming the backend returns the token in a 'token' property
        if (response && response.token) {
          this.storeToken(response.token);
        }
      })
    );
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);

    // Check for token existence and validity (as previously discussed)
    if (token) {
      // In a real app, you would add this.isTokenExpired(token) check here.
      return true;
    }
    return false;
  }
}
