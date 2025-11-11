import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly API_URL = 'https://ecommerce.routemisr.com/api/v1/orders';

  constructor(private http: HttpClient) {}

  /**
   * Create cash order
   * @param cartId - The cart ID
   * @param shippingAddress - Address object with details, phone, city
   */
  createCashOrder(cartId: string, shippingAddress: any): Observable<any> {
    return this.http.post(`${this.API_URL}/${cartId}`, {
      shippingAddress,
    });
  }

  /**
   * Get all orders for logged user
   * @param userId - The user ID
   */
  getUserOrders(userId: string): Observable<any> {
    return this.http.get(`${this.API_URL}/user/${userId}`);
  }

  /**
   * Create checkout session (for online payment)
   * @param cartId - The cart ID
   * @param shippingAddress - Address object with details, phone, city
   */
  checkoutSession(cartId: string, shippingAddress: any): Observable<any> {
    return this.http.post(
      `${this.API_URL}/checkout-session/${cartId}`,
      { shippingAddress },
      {
        params: {
          url: 'http://localhost:4200', // Your frontend URL for redirect after payment
        },
      }
    );
  }
}
