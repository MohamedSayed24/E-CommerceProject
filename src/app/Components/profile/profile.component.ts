import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AddressService } from '../../Core/services/address.service';
import { AuthService } from '../../Core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  userData: any = {};
  addresses: any[] = [];
  isLoadingAddresses: boolean = false;

  constructor(
    private addressService: AddressService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadAddresses();
  }

  loadUserData(): void {
    // First try to get from localStorage (stored during login/signup)
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        this.userData = JSON.parse(storedUserData);
        return;
      } catch (e) {
        console.error('Error parsing stored user data:', e);
      }
    }

    // Fallback: decode from token if localStorage doesn't have user data
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = this.decodeToken(token);
      if (payload) {
        this.userData = {
          name: payload.name || 'N/A',
          email: payload.email || 'N/A',
          role: payload.role || 'user',
          id: payload.id || '',
        };
        // Store it for next time
        localStorage.setItem('userData', JSON.stringify(this.userData));
      }
    }
  }

  decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = parts[1];
      let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }

      return JSON.parse(atob(base64));
    } catch (e) {
      return null;
    }
  }

  loadAddresses(): void {
    this.isLoadingAddresses = true;
    this.addressService.getLoggedUserAddresses().subscribe({
      next: (response) => {
        this.addresses = response.data || [];
        this.isLoadingAddresses = false;
      },
      error: (error) => {
        console.error('Error loading addresses:', error);
        this.isLoadingAddresses = false;
      },
    });
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }
}
