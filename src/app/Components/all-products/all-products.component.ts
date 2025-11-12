import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../Core/services/product.service';
import { CartService } from '../../Core/services/cart.service';
import { WishlistService } from '../../Core/services/wishlist.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastService } from '../../Core/services/toast.service';

interface Product {
  _id: string;
  title: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  category: {
    _id: string;
    name: string;
  };
  brand?: {
    _id: string;
    name: string;
  };
  subcategory?: Array<{
    _id: string;
    name: string;
  }>;
  description?: string;
  quantity: number;
}

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './all-products.component.html',
})
export class AllProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  addingToCartProductId: string | null = null;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;

  // Math for template
  Math = Math;

  // Subscriptions for cleanup
  private getAllProductsSubscription!: Subscription;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAllProducts();
  }

  ngOnDestroy(): void {
    this.getAllProductsSubscription?.unsubscribe();
  }

  /**
   * Load all products from both API pages
   */
  loadAllProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Fetch products from both pages
    this.getAllProductsSubscription = forkJoin([
     this.productService.getAllProducts(1),
      this.productService.getAllProducts(2),
    ])
      .pipe(
        map(([page1, page2]) => {
          // Combine the data arrays from both pages
          return [...page1.data, ...page2.data];
        })
      )
      .subscribe({
        next: (allProducts) => {
          this.products = allProducts;
          this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load products. Please try again.';
          this.isLoading = false;
          console.error('Error loading products:', error);
        },
      });
  }

  /**
   * Get paginated products for current page
   */
  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.products.slice(startIndex, endIndex);
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

  /**
   * Add product to cart
   */
  addToCart(productId: string): void {
    if (this.addingToCartProductId === productId) {
      return;
    }

    this.addingToCartProductId = productId;

    this.cartService.addProductToCart(productId).subscribe({
      next: (response) => {
        this.addingToCartProductId = null;
        this.toastService.success('Product added to cart!');
        console.log('Added to cart:', response);
      },
      error: (error) => {
        this.addingToCartProductId = null;
        this.toastService.error('Failed to add to cart');
        console.error('Error adding to cart:', error);
      },
    });
  }

  /**
   * Add product to wishlist
   */
  addToWishlist(productId: string): void {
    this.wishlistService.addToWishlist(productId).subscribe({
      next: (response) => {
        this.toastService.success('Added to wishlist!');
        console.log('Added to wishlist:', response);
      },
      error: (error) => {
        this.toastService.error('Failed to add to wishlist');
        console.error('Error adding to wishlist:', error);
      },
    });
  }

  /**
   * Navigate to product details
   */
  viewProductDetails(productId: string): void {
    this.router.navigate(['/blank/products', productId]);
  }

  /**
   * Navigate back to home
   */
  goBack(): void {
    this.router.navigate(['/blank/home']);
  }
}
