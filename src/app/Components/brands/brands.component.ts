import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandService } from '../../Core/services/brand.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brands.component.html',
})
export class BrandsComponent implements OnInit {
  brands: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;

  // Math for template
  Math = Math;

  constructor(private _brandService: BrandService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllBrands();
  }

  loadAllBrands(): void {
    this.isLoading = true;
    // Use getAllBrandsFromAllPages() to fetch all brands from all pages
    this._brandService.getAllBrandsFromAllPages().subscribe({
      next: (brands) => {
        this.brands = brands; // Already returns just the array of brands
        this.totalPages = Math.ceil(this.brands.length / this.itemsPerPage);
        this.isLoading = false;
        console.log(`Loaded ${this.brands.length} brands from all pages`);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load brands';
        this.isLoading = false;
        console.error('Error loading brands:', error);
      },
    });
  }

  /**
   * Get paginated brands for current page
   */
  get paginatedBrands(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.brands.slice(startIndex, endIndex);
  }

  /**
   * Get array of page numbers for pagination
   */
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /**
   * Change to specific page
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Go to previous page
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Go to next page
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  viewBrandProducts(brandId: string): void {
    this.router.navigate(['/blank/brands', brandId]);
  }
}
