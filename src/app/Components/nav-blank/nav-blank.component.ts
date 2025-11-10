import { AuthService } from '../../Core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { WishlistService } from '../../Core/services/wishlist.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav-blank.component.html',
})
export class NavBlankComponent implements OnInit {
  wishlistCount: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    // Subscribe to wishlist count changes
    this.wishlistService.wishlistCount$.subscribe((count) => {
      this.wishlistCount = count;
    });

    // Load initial wishlist count
    this.wishlistService.getUserWishlist().subscribe({
      next: () => {},
      error: () => {},
    });
  }

  SignOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
