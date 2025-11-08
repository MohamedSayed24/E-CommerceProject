import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../services/brand.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-branddetails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './branddetails.component.html'
})
export class BranddetailsComponent implements OnInit {
  brandId!: string;
  brand: any = null;
  products: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private _brandsService: BrandService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.brandId = this.route.snapshot.paramMap.get('id') || '';
    this.loadBrandDetails();
    this.loadBrandProducts();
  }

  loadBrandDetails(): void {
    this._brandsService.getBrandById(this.brandId).subscribe({
      next: (response) => {
        this.brand = response.data;
      },
      error: (error) => {
        console.error('Error loading brand:', error);
      }
    });
  }

  loadBrandProducts(): void {
    this.isLoading = true;
    this._brandsService.getBrandProducts(this.brandId).subscribe({
      next: (response) => {
        this.products = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load products';
        this.isLoading = false;
        console.error('Error loading products:', error);
      }
    });
  }

  addToCart(product: any): void {
    console.log('Adding to cart:', product);
    // Add your cart logic here
  }

  goBack(): void {
    this.router.navigate(['/blank/brands']);
  }
}