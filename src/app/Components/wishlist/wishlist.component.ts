import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../Core/services/wishlist.service';
import { CartService } from '../../Core/services/cart.service';
import { ToastService } from '../../Core/services/toast.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistProducts: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  addingToCartProductId: string | null = null;

  // Subscriptions for cleanup
  private loadWishlistSubscription!: Subscription;
  private removeFromWishlistSubscription!: Subscription;
  private addToCartSubscription!: Subscription;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  ngOnDestroy(): void {
    this.loadWishlistSubscription?.unsubscribe();
    this.removeFromWishlistSubscription?.unsubscribe();
    this.addToCartSubscription?.unsubscribe();
  }

  loadWishlist(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.loadWishlistSubscription = this.wishlistService.getUserWishlist().subscribe({
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
    this.removeFromWishlistSubscription = this.wishlistService.removeFromWishlist(productId).subscribe({
      next: (response) => {
        this.toastService.success('Product removed from wishlist');
        console.log('Product removed from wishlist:', response);
        // Reload the wishlist after removing
        this.loadWishlist();
      },
      error: (error) => {
        console.error('Error removing from wishlist:', error);
        this.toastService.error('Failed to remove item. Please try again.');
        this.errorMessage = 'Failed to remove item. Please try again.';
      },
    });
  }

  addToCart(product: any, event: Event): void {
    event.preventDefault();

    if (!product._id || this.addingToCartProductId === product._id) {
      return;
    }

    this.addingToCartProductId = product._id;

    this.addToCartSubscription = this.cartService.addProductToCart(product._id).subscribe({
      next: (response) => {
        this.addingToCartProductId = null;
        this.toastService.success('Added to cart!');
        console.log('Added to cart:', response);
        // Optionally remove from wishlist after adding to cart
        // this.removeFromWishlist(product._id);
      },
      error: (error) => {
        this.addingToCartProductId = null;
        this.toastService.error('Failed to add item to cart. Please try again.');
        console.error('Error adding to cart:', error);
        this.errorMessage = 'Failed to add item to cart. Please try again.';
      },
    });
  }
}
