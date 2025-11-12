import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddressService } from '../../Core/services/address.service';
import { CartService } from '../../Core/services/cart.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit, OnDestroy {
  addresses: any[] = [];
  selectedAddress: any = null;
  selectedAddressId: string = '';
  cartData: any = null;
  isLoading: boolean = true;
  isProcessingPayment: boolean = false;
  isProcessingOrder: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  paymentMethod: 'cash' | 'card' | 'online' = 'cash';

  // Subscriptions for cleanup
  private loadAddressesSubscription!: Subscription;
  private loadCartSubscription!: Subscription;
  private checkoutSubscription!: Subscription;

  constructor(
    private addressService: AddressService,
    private cartService: CartService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadAddresses();
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.loadAddressesSubscription?.unsubscribe();
    this.loadCartSubscription?.unsubscribe();
    this.checkoutSubscription?.unsubscribe();
  }

  loadAddresses(): void {
    this.isLoading = true;
    this.loadAddressesSubscription = this.addressService
      .getLoggedUserAddresses()
      .subscribe({
        next: (response) => {
          this.addresses = response.data || [];
          if (this.addresses.length > 0) {
            this.selectedAddress = this.addresses[0];
            this.selectedAddressId = this.addresses[0]._id;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading addresses:', error);
          this.errorMessage = 'Failed to load addresses';
          this.isLoading = false;
        },
      });
  }

  loadCart(): void {
    this.loadCartSubscription = this.cartService.getLoggedUserCart().subscribe({
      next: (response) => {
        this.cartData = response.data;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.errorMessage = 'Failed to load cart';
      },
    });
  }

  selectAddress(address: any): void {
    this.selectedAddress = address;
    this.selectedAddressId = address._id;
    this.clearMessages();
  }

  selectPaymentMethod(method: 'cash' | 'online'): void {
    this.paymentMethod = method as any;
    this.clearMessages();
  }

  goToAddresses(): void {
    this.router.navigate(['/blank/addresses']);
  }

  proceedToPayment(): void {
    this.checkout();
  }

  checkout(): void {
    if (!this.selectedAddress || !this.selectedAddressId) {
      this.errorMessage = 'Please select a delivery address';
      return;
    }

    if (!this.cartData || !this.cartData._id) {
      this.errorMessage = 'Cart is empty';
      return;
    }

    this.isProcessingPayment = true;
    this.isProcessingOrder = true;
    this.clearMessages();

    const url =
      this.paymentMethod === 'cash'
        ? `https://ecommerce.routemisr.com/api/v1/orders/${this.cartData._id}`
        : `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${this.cartData._id}?url=http://localhost:4200/blank`;

    const orderData = {
      shippingAddress: {
        details: this.selectedAddress.details,
        phone: this.selectedAddress.phone,
        city: this.selectedAddress.city,
      },
    };

    this.checkoutSubscription = this.http.post(url, orderData).subscribe({
      next: (response: any) => {
        this.isProcessingPayment = false;
        this.isProcessingOrder = false;
        if (this.paymentMethod === 'cash') {
          this.successMessage = 'Order placed successfully!';
          this.cartService.refreshCart();
          setTimeout(() => {
            this.router.navigate(['/blank/orders']);
          }, 2000);
        } else {
          // Redirect to Stripe payment page
          if (response.session && response.session.url) {
            window.location.href = response.session.url;
          }
        }
      },
      error: (error) => {
        console.error('Error processing checkout:', error);
        this.errorMessage = 'Failed to process order. Please try again.';
        this.isProcessingPayment = false;
        this.isProcessingOrder = false;
      },
    });
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  getTotalItems(): number {
    if (!this.cartData || !this.cartData.products) return 0;
    return this.cartData.products.reduce(
      (sum: number, item: any) => sum + item.count,
      0
    );
  }
}
