import { AuthService } from '../../Core/services/auth.service';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../Core/services/wishlist.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav-blank.component.html',
})
export class NavBlankComponent implements OnInit, OnDestroy {
  wishlistCount: number = 0;
  isProfileDropdownOpen: boolean = false;
  userName: string = '';

  // Subscriptions for cleanup
  private wishlistCountSubscription!: Subscription;
  private loadWishlistSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    // Subscribe to wishlist count changes
    this.wishlistCountSubscription = this.wishlistService.wishlistCount$.subscribe((count) => {
      this.wishlistCount = count;
    });

    // Load initial wishlist count
    this.loadWishlistSubscription = this.wishlistService.getUserWishlist().subscribe({
      next: () => {},
      error: () => {},
    });

    // Get user name from localStorage or token
    this.getUserName();
  }

  ngOnDestroy(): void {
    this.wishlistCountSubscription?.unsubscribe();
    this.loadWishlistSubscription?.unsubscribe();
  }

  getUserName(): void {
    // First try to get from localStorage (stored during login/signup)
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        this.userName = userData.name || 'User';
        return;
      } catch (e) {
        console.error('Error parsing stored user data:', e);
      }
    }

    // Fallback: decode from token
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = this.decodeToken(token);
      if (payload) {
        this.userName = payload.name || 'User';
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

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  closeProfileDropdown(): void {
    this.isProfileDropdownOpen = false;
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.profile-dropdown-container');
    if (!clickedInside && this.isProfileDropdownOpen) {
      this.closeProfileDropdown();
    }
  }

  navigateToProfile(): void {
    this.closeProfileDropdown();
    this.router.navigate(['/blank/profile']);
  }

  navigateToOrders(): void {
    this.closeProfileDropdown();
    this.router.navigate(['/blank/orders']);
  }

  navigateToAddresses(): void {
    this.closeProfileDropdown();
    this.router.navigate(['/blank/addresses']);
  }

  SignOut(): void {
    this.closeProfileDropdown();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
