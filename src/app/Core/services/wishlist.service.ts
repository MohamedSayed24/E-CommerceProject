import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly API_URL = 'https://ecommerce.routemisr.com/api/v1/wishlist';
  private wishlistCountSubject = new BehaviorSubject<number>(0);
  public wishlistCount$ = this.wishlistCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  addToWishlist(productId: string): Observable<any> {
    return this.http.post(`${this.API_URL}`, { productId }).pipe(
      tap((response: any) => {
        if (response.data) {
          this.wishlistCountSubject.next(response.data.length);
        }
      })
    );
  }

  removeFromWishlist(productId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${productId}`).pipe(
      tap((response: any) => {
        if (response.data) {
          this.wishlistCountSubject.next(response.data.length);
        }
      })
    );
  }

  getUserWishlist(): Observable<any> {
    return this.http.get(`${this.API_URL}`).pipe(
      tap((response: any) => {
        if (response.data) {
          this.wishlistCountSubject.next(response.data.length);
        }
      })
    );
  }

  updateWishlistCount(count: number): void {
    this.wishlistCountSubject.next(count);
  }
}
