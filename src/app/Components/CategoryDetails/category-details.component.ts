import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../Core/services/category.service';
import { SubCategoriesComponent } from '../sub-categories/sub-categories.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductService } from '../../Core/services/product.service';
import { WishlistService } from '../../Core/services/wishlist.service';
import { CartService } from '../../Core/services/cart.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ToastService } from '../../Core/services/toast.service';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [AsyncPipe, SubCategoriesComponent, ProductCardComponent],
  templateUrl: './category-details.component.html',
})
export class CategoryDetailsComponent implements OnInit {
  category$!: Observable<any>;
  categoryId!: string;
  products$!: Observable<any>;
  addingToCartProductId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoriesService,
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Get the category ID from the route parameters
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';

    if (this.categoryId) {
      // Initialize category data
      this.category$ = this.categoryService.getCategoryById(this.categoryId);

      // Fetch products from both pages and combine them
      this.products$ = forkJoin([
        this.productService.getAllProducts(1),
        this.productService.getAllProducts(2),
      ]).pipe(
        map(([page1, page2]) => {
          // Combine the data arrays from both pages
          return {
            data: [...page1.data, ...page2.data],
            metadata: page1.metadata, // Keep metadata from first page
            results: page1.results + page2.results,
          };
        })
      );
    }
  }

  hasProductsInCategory(products: any[]): boolean {
    if (!products || products.length === 0) {
      return false;
    }
    return products.some((product) => product.category._id === this.categoryId);
  }

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

  viewProductDetails(productId: string): void {
    this.router.navigate(['/blank/products', productId]);
  }

  goBack(): void {
    this.router.navigate(['/blank/categories']);
  }
}
