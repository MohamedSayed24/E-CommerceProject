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



  // SubCategories 
  getAllSubCategories():Observable<any>
  {
    return this.http.get(`${this.API_URL}/subcategories`);
  }

  getSpecificSubCategory(Id:string):Observable<any>
  {
    return this.http.get(`${this.API_URL}/subcategories/${Id}`);
  }

  getAllSubCategoriesOfCategory(CategoryId:string):Observable<any>
  {
    return this.http.get(`${this.API_URL}/categories/${CategoryId}/subcategories`);
  }
  getAllCategories(): Observable<any> {
    return this.http.get(`${this.API_URL}/categories`);
  }

  getCategoryById(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/categories/${id}`);

  }
}
