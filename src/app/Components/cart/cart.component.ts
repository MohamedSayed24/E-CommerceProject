import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartData, CartProduct } from '../../Core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit, OnDestroy {
  cartData: CartData | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  isUpdating: boolean = false;
  showClearModal: boolean = false;

  // Subscriptions for cleanup
  private loadCartSubscription!: Subscription;
  private updateQuantitySubscription!: Subscription;
  private removeItemSubscription!: Subscription;
  private clearCartSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.loadCartSubscription?.unsubscribe();
    this.updateQuantitySubscription?.unsubscribe();
    this.removeItemSubscription?.unsubscribe();
    this.clearCartSubscription?.unsubscribe();
  }

  /**
   * Load cart data
   */
  loadCart(): void {
    this.isLoading = true;
    this.loadCartSubscription = this.cartService.getLoggedUserCart().subscribe({
      next: (response) => {
        this.cartData = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load cart. Please try again.';
        this.isLoading = false;
        console.error('Error loading cart:', err);
      }
    });
  }

  /**
   * Update product quantity
   */
  updateQuantity(productId: string, newCount: number): void {
    if (newCount < 1) return; // Prevent quantity less than 1
    
    this.isUpdating = true;
    this.updateQuantitySubscription = this.cartService.updateCartProductQuantity(productId, newCount).subscribe({
      next: (response) => {
        this.cartData = response.data;
        this.isUpdating = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to update quantity.';
        this.isUpdating = false;
        console.error('Error updating quantity:', err);
      }
    });
  }

  /**
   * Increase product quantity
   */
  increaseQuantity(item: CartProduct): void {
    this.updateQuantity(item.product._id, item.count + 1);
  }

  /**
   * Decrease product quantity
   */
  decreaseQuantity(item: CartProduct): void {
    if (item.count > 1) {
      this.updateQuantity(item.product._id, item.count - 1);
    }
  }

  /**
   * Remove item from cart
   */
  removeItem(productId: string): void {
    this.isUpdating = true;
    this.removeItemSubscription = this.cartService.removeSpecificCartItem(productId).subscribe({
      next: (response) => {
        this.cartData = response.data;
        this.isUpdating = false;
        
        // If cart is empty after removal, set cartData to null
        if (response.numOfCartItems === 0) {
          this.cartData = null;
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to remove item.';
        this.isUpdating = false;
        console.error('Error removing item:', err);
      }
    });
  }

  /**
   * Show clear cart confirmation modal
   */
  openClearModal(): void {
    this.showClearModal = true;
  }

  /**
   * Close clear cart modal
   */
  closeClearModal(): void {
    this.showClearModal = false;
  }

  /**
   * Clear entire cart (after confirmation)
   */
  clearCart(): void {
    this.closeClearModal();
    this.isUpdating = true;
    
    this.clearCartSubscription = this.cartService.clearUserCart().subscribe({
      next: () => {
        this.cartData = null;
        this.isUpdating = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to clear cart.';
        this.isUpdating = false;
        console.error('Error clearing cart:', err);
      }
    });
  }

  /**
   * Calculate item subtotal
   */
  getItemSubtotal(item: CartProduct): number {
    // Use the price from the cart item, not from product
    return item.price * item.count;
  }

  /**
   * Get the unit price for display
   */
  getItemPrice(item: CartProduct): number {
    return item.price;
  }

  /**
   * Navigate to checkout
   */
  proceedToCheckout(): void {
    // Navigate to checkout page (you can implement this later)
    this.router.navigate(['/blank/checkout']);
  }

  /**
   * Continue shopping
   */
  continueShopping(): void {
    this.router.navigate(['/blank/home']);
  }
}
