import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../Core/services/order.service';
import { AuthService } from '../../Core/services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  userId: string = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getUserIdAndLoadOrders();
  }

  getUserIdAndLoadOrders(): void {
    // Get user ID from token
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = this.decodeToken(token);
      if (payload && payload.id) {
        this.userId = payload.id;
        this.loadOrders();
      } else {
        this.errorMessage = 'Unable to retrieve user information';
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

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.getUserOrders(this.userId).subscribe({
      next: (response) => {
        // The API returns orders directly in the response array
        this.orders = response || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.errorMessage = 'Failed to load orders. Please try again.';
        this.isLoading = false;
      },
    });
  }

  getOrderStatusClass(status: string): string {
    const statusClasses: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return statusClasses[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  }

  getPaymentStatusClass(isPaid: boolean): string {
    return isPaid
      ? 'bg-green-100 text-green-800'
      : 'bg-orange-100 text-orange-800';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
