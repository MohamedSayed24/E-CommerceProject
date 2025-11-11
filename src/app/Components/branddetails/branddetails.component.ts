import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../Core/services/brand.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../Core/services/wishlist.service';
import { CartService } from '../../Core/services/cart.service';

@Component({
  selector: 'app-branddetails',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './branddetails.component.html',
})
export class BranddetailsComponent implements OnInit {
  brandId!: string;
  brand: any = null;
  products: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  addingToCartProductId: string | null = null;

  constructor(
    private _brandsService: BrandService,
    private route: ActivatedRoute,
    private router: Router,
    private wishlistService: WishlistService,
    private cartService: CartService
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
      },
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
      },
    });
  }

  addToWishlist(productId: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.wishlistService.addToWishlist({ productId }).subscribe({
      next: (response) => {
        console.log('Added to wishlist:', response);
      },
      error: (error) => {
        console.error('Error adding to wishlist:', error);
      },
    });
  }

  addToCart(product: any, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!product._id || this.addingToCartProductId === product._id) {
      return;
    }

    this.addingToCartProductId = product._id;

    this.cartService.addProductToCart(product._id).subscribe({
      next: (response) => {
        this.addingToCartProductId = null;
        console.log('Added to cart:', response);
        // You can add a toast notification here if you have one
      },
      error: (error) => {
        this.addingToCartProductId = null;
        console.error('Error adding to cart:', error);
        // You can add an error toast notification here
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/blank/brands']);
  }
}
