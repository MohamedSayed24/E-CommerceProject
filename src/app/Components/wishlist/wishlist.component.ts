import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../Core/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
})
export class WishlistComponent implements OnInit {
  wishlistProducts: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.wishlistService.getUserWishlist().subscribe({
      next: (response) => {
        this.wishlistProducts = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
        this.errorMessage = 'Failed to load wishlist. Please try again.';
        this.isLoading = false;
      },
    });
  }

  removeFromWishlist(productId: string): void {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: (response) => {
        console.log('Product removed from wishlist:', response);
        // Reload the wishlist after removing
        this.loadWishlist();
      },
      error: (error) => {
        console.error('Error removing from wishlist:', error);
        this.errorMessage = 'Failed to remove item. Please try again.';
      },
    });
  }

  addToCart(product: any, event: Event): void {
    event.preventDefault();
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product);
  }
}
