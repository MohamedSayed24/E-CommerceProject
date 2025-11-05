import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly API_URL = 'https://ecommerce.routemisr.com/api/v1';
  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<any> {
    return this.http.get(`${this.API_URL}/categories`);
  }

  getCategoryById(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/categories/${id}`);
  }
}
