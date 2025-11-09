import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandService } from '../../Core/services/brand.service';
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
    // Use getAllBrandsFromAllPages() to fetch all brands from all pages
    this._brandService.getAllBrandsFromAllPages().subscribe({
      next: (brands) => {
        this.brands = brands; // Already returns just the array of brands
        this.isLoading = false;
        console.log(`Loaded ${this.brands.length} brands from all pages`);
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
