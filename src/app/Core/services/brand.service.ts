import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, switchMap } from 'rxjs';

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

  // Get brands from a specific page
  getBrandsByPage(page: number = 1): Observable<any> {
    return this.http.get(`${this.API_URL}/brands?page=${page}`);
  }

  // Get ALL brands from all pages
  getAllBrandsFromAllPages(): Observable<any[]> {
    return this.getBrandsByPage(1).pipe(
      switchMap((firstPageResponse: any) => {
        const totalPages = firstPageResponse.metadata?.numberOfPages || 1;
        const allBrands = [...firstPageResponse.data];

        // If there's only one page, return it
        if (totalPages === 1) {
          return new Observable<any[]>(observer => {
            observer.next(allBrands);
            observer.complete();
          });
        }

        // Create requests for remaining pages
        const pageRequests: Observable<any>[] = [];
        for (let page = 2; page <= totalPages; page++) {
          pageRequests.push(this.getBrandsByPage(page));
        }

        // Execute all requests in parallel
        return forkJoin(pageRequests).pipe(
          map((responses: any[]) => {
            // Combine all brands from all pages
            responses.forEach(response => {
              allBrands.push(...response.data);
            });
            return allBrands;
          })
        );
      })
    );
  }

  getBrandById(Id:string):Observable<any>
  {
    return this.http.get(`${this.API_URL}/brands/${Id}`);
  }
  getBrandProducts(brandId: string): Observable<any> {
  return this.http.get(`${this.API_URL}/products?brand=${brandId}`);
}
}
