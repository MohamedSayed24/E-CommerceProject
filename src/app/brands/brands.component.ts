import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandService } from '../services/brand.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brands.component.html'
})
export class BrandsComponent implements OnInit {
  brands: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  
  constructor(
    private _brandService: BrandService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAllBrands();
  }

  loadAllBrands(): void {
    this.isLoading = true;
    this._brandService.getAllBrands().subscribe({
      next: (response) => {
        this.brands = response.data; // Adjust based on your API response structure
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load brands';
        this.isLoading = false;
        console.error('Error loading brands:', error);
      }
    });
  }

  viewBrandProducts(brandId: string): void {
    this.router.navigate(['/blank/brands', brandId]);
  }
}
