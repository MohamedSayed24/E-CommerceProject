import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly API_URL = 'https://ecommerce.routemisr.com/api/v1';
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this.http.get(`${this.API_URL}/products`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/products/${id}`);
  }
}
