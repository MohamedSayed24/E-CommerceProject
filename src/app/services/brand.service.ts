import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private readonly API_URL = 'https://ecommerce.routemisr.com/api/v1'
  constructor(private http: HttpClient) { }


  getAllBrands():Observable<any>
  {
    return this.http.get(`${this.API_URL}/brands`);
  }

  getBrandById(Id:string):Observable<any>
  {
    return this.http.get(`${this.API_URL}/brands/${Id}`);
  }
  getBrandProducts(brandId: string): Observable<any> {
  return this.http.get(`${this.API_URL}/products?brand=${brandId}`);
}
}
