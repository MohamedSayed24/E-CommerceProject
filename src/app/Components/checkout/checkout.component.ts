import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AddressService } from '../../Core/services/address.service';
import { OrderService } from '../../Core/services/order.service';
import { CartService } from '../../Core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  addresses: any[] = [];
  selectedAddressId: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showAddressSelection: boolean = true;

  cartData: any = null;
  cartId: string = '';
  isProcessingOrder: boolean = false;
  paymentMethod: 'cash' | 'online' = 'cash';

  constructor(
    private addressService: AddressService,
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAddresses();
    this.loadCart();
  }

  loadAddresses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.addressService.getLoggedUserAddresses().subscribe({
      next: (response) => {
        this.addresses = response.data || [];
        this.isLoading = false;

        // Auto-select first address if available
        if (this.addresses.length > 0) {
          this.selectedAddressId = this.addresses[0]._id;
        }
      },
      error: (error) => {
        console.error('Error loading addresses:', error);
        this.errorMessage = 'Failed to load addresses. Please try again.';
        this.isLoading = false;
      },
    });
  }

  loadCart(): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (response) => {
        this.cartData = response.data;
        this.cartId = response.data._id;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
      },
    });
  }

  selectAddress(addressId: string): void {
    this.selectedAddressId = addressId;
  }

  selectPaymentMethod(method: 'cash' | 'online'): void {
    this.paymentMethod = method;
  }

  getSelectedAddress(): any {
    return this.addresses.find((addr) => addr._id === this.selectedAddressId);
  }

  proceedToPayment(): void {
    if (!this.selectedAddressId) {
      this.errorMessage = 'Please select a delivery address';
      return;
    }

    if (!this.cartId) {
      this.errorMessage = 'Cart not found. Please add items to cart first.';
      return;
    }

    const selectedAddress = this.getSelectedAddress();
    if (!selectedAddress) {
      this.errorMessage = 'Selected address not found';
      return;
    }

    // Prepare shipping address object
    const shippingAddress = {
      details: selectedAddress.details,
      phone: selectedAddress.phone,
      city: selectedAddress.city,
    };

    this.isProcessingOrder = true;
    this.errorMessage = '';

    if (this.paymentMethod === 'cash') {
      this.createCashOrder(shippingAddress);
    } else {
      this.createCheckoutSession(shippingAddress);
    }
  }

  createCashOrder(shippingAddress: any): void {
    this.orderService.createCashOrder(this.cartId, shippingAddress).subscribe({
      next: (response) => {
        console.log('Cash order created:', response);
        this.successMessage = 'Order placed successfully!';
        this.isProcessingOrder = false;

        // Redirect to orders page or success page after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/blank/orders']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating cash order:', error);
        this.errorMessage =
          error.error?.message || 'Failed to place order. Please try again.';
        this.isProcessingOrder = false;
      },
    });
  }

  createCheckoutSession(shippingAddress: any): void {
    this.orderService.checkoutSession(this.cartId, shippingAddress).subscribe({
      next: (response) => {
        console.log('Checkout session created:', response);

        // Redirect to payment gateway
        if (response.session && response.session.url) {
          window.location.href = response.session.url;
        } else {
          this.errorMessage = 'Payment session URL not found';
          this.isProcessingOrder = false;
        }
      },
      error: (error) => {
        console.error('Error creating checkout session:', error);
        this.errorMessage =
          error.error?.message ||
          'Failed to initiate payment. Please try again.';
        this.isProcessingOrder = false;
      },
    });
  }

  goToAddresses(): void {
    this.router.navigate(['/blank/addresses']);
  }
}
