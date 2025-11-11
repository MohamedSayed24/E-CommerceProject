import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';

// Interfaces for type safety
export interface CartProduct {
  count: number;
  _id: string;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    price: number;
    priceAfterDiscount?: number;
  };
  price: number;
}

export interface CartData {
  _id: string;
  cartOwner: string;
  products: CartProduct[];
  totalCartPrice: number;
  __v: number;
}

export interface CartResponse {
  status: string;
  numOfCartItems: number;
  data: CartData;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly API_URL = 'https://ecommerce.routemisr.com/api/v1';
  
  // BehaviorSubject to track cart count in real-time
  private cartItemCount$ = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartItemCount$.asObservable();

  // BehaviorSubject to track cart data
  private cartData$ = new BehaviorSubject<CartData | null>(null);
  public cart$ = this.cartData$.asObservable();

  constructor(private _http: HttpClient) {
    // Load cart on service initialization
    this.loadCart();
  }

  /**
   * Load cart and update observables
   */
  private loadCart(): void {
    this.getLoggedUserCart().subscribe({
      next: (response) => {
        if (response.data) {
          this.cartItemCount$.next(response.numOfCartItems);
          this.cartData$.next(response.data);
        }
      },
      error: (err) => {
        // Silent fail on initialization, user might not be logged in
        console.log('Cart not loaded:', err);
      }
    });
  }

  /**
   * Add product to cart
   */
  addProductToCart(productId: string): Observable<CartResponse> {
    return this._http.post<CartResponse>(`${this.API_URL}/cart`, { productId }).pipe(
      tap((response) => {
        // Update cart count and data after successful addition
        this.cartItemCount$.next(response.numOfCartItems);
        this.cartData$.next(response.data);
      }),
      catchError((error) => {
        console.error('Error adding product to cart:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update product quantity in cart
   */
  updateCartProductQuantity(productId: string, count: number): Observable<CartResponse> {
    return this._http.put<CartResponse>(`${this.API_URL}/cart/${productId}`, { count }).pipe(
      tap((response) => {
        // Update cart count and data after successful update
        this.cartItemCount$.next(response.numOfCartItems);
        this.cartData$.next(response.data);
      }),
      catchError((error) => {
        console.error('Error updating product quantity:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get logged user's cart
   */
  getLoggedUserCart(): Observable<CartResponse> {
    return this._http.get<CartResponse>(`${this.API_URL}/cart`).pipe(
      tap((response) => {
        // Update cart count and data
        this.cartItemCount$.next(response.numOfCartItems);
        this.cartData$.next(response.data);
      }),
      catchError((error) => {
        console.error('Error fetching cart:', error);
        // Reset cart on error
        this.cartItemCount$.next(0);
        this.cartData$.next(null);
        return throwError(() => error);
      })
    );
  }

  /**
   * Remove specific item from cart
   */
  removeSpecificCartItem(productId: string): Observable<CartResponse> {
    return this._http.delete<CartResponse>(`${this.API_URL}/cart/${productId}`).pipe(
      tap((response) => {
        // Update cart count and data after successful removal
        this.cartItemCount$.next(response.numOfCartItems);
        this.cartData$.next(response.data);
      }),
      catchError((error) => {
        console.error('Error removing item from cart:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Clear entire cart
   */
  clearUserCart(): Observable<any> {
    return this._http.delete(`${this.API_URL}/cart`).pipe(
      tap(() => {
        // Reset cart count and data after clearing
        this.cartItemCount$.next(0);
        this.cartData$.next(null);
      }),
      catchError((error) => {
        console.error('Error clearing cart:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get current cart item count (synchronous)
   */
  getCartCount(): number {
    return this.cartItemCount$.value;
  }

  /**
   * Get current cart data (synchronous)
   */
  getCurrentCart(): CartData | null {
    return this.cartData$.value;
  }

  /**
   * Check if a product exists in cart
   */
  isProductInCart(productId: string): boolean {
    const cart = this.cartData$.value;
    if (!cart || !cart.products) return false;
    return cart.products.some(item => item.product._id === productId);
  }

  /**
   * Get product quantity in cart
   */
  getProductQuantity(productId: string): number {
    const cart = this.cartData$.value;
    if (!cart || !cart.products) return 0;
    const product = cart.products.find(item => item.product._id === productId);
    return product ? product.count : 0;
  }

  /**
   * Calculate total cart price
   */
  getTotalPrice(): number {
    const cart = this.cartData$.value;
    return cart ? cart.totalCartPrice : 0;
  }

  /**
   * Refresh cart data from server
   */
  refreshCart(): void {
    this.loadCart();
  }
}