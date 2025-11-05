import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Helper function to decode the payload of a JWT
function decodeJwtPayload(token: string): any | null {
  try {
    // JWTs have three parts: Header.Payload.Signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null; // Not a valid JWT structure
    }
    
    // Decode the payload part (which is Base64Url-encoded)
    const payload = parts[1];
    
    // Convert Base64Url to regular Base64 by padding and replacing URL-safe chars
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    
    // Decode and parse the JSON payload
    return JSON.parse(atob(base64));
  } catch (e) {
    return null; // Decoding failed (invalid Base64 or JSON)
  }
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'https://ecommerce.routemisr.com/api/v1/auth';
  private readonly TOKEN_KEY = 'authToken';
  constructor(private http: HttpClient) {}

  // check integrity of token

  private isTokenValid(token: string): boolean {
    const payload = decodeJwtPayload(token);

    if (!payload || !payload.exp) {
      // Token is structurally invalid or missing the expiration claim (exp)
      this.logout(); // Remove the invalid token
      return false;
    }

    // JWT expiration time (exp) is in seconds (Unix timestamp)
    const expirationTimeSeconds = payload.exp;
    // Current time in milliseconds, converted to seconds
    const currentTimeSeconds = Math.floor(Date.now() / 1000);

    // Check if the token has expired
    if (expirationTimeSeconds < currentTimeSeconds) {
      console.warn('JWT has expired.');
      this.logout(); // Remove the expired token
      return false;
    }

    // Token is valid (well-formed and not expired)
    return true;
  }
  

  //Login
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
      return this.isTokenValid(token);
    }
    return false;
  }

  // reset password 
  forgotPassword(email: string): Observable<any> {
  return this.http.post(`${this.API_URL}/forgotPasswords`, { email });
}

verifyResetCode(resetCode: string, email: string): Observable<any> {
  // Corrected: Include the 'email' along with the 'resetCode' in the request body.
  const requestBody = { 
    email: email, 
    resetCode: resetCode 
  };
  
  // Send the complete object
  return this.http.post(`${this.API_URL}/verifyResetCode`, requestBody);
}

resetPassword(email: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.API_URL}/resetPassword`, { 
      email, 
      newPassword 
    });
  }
}
