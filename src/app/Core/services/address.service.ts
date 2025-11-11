import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly API_URL = 'https://ecommerce.routemisr.com/api/v1/addresses';

  constructor(private http: HttpClient) {}

  // Add a new address
  addAddress(addressData: any): Observable<any> {
    return this.http.post(this.API_URL, addressData);
  }

  // Remove an address by ID
  removeAddress(addressId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${addressId}`);
  }

  // Get a specific address by ID
  getSpecificAddress(addressId: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${addressId}`);
  }

  // Get all logged user addresses
  getLoggedUserAddresses(): Observable<any> {
    return this.http.get(this.API_URL);
  }
}
