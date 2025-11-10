import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoriesService } from '../../Core/services/category.service';
import { ProductService } from '../../Core/services/product.service';
import { WishlistService } from '../../Core/services/wishlist.service';

@Component({
  selector: 'app-sub-category-details',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink],
  templateUrl: './sub-category-details.component.html',
})
export class SubCategoryDetailsComponent implements OnInit {
  subCategory$!: Observable<any>;
  products$!: Observable<any>;
  subCategoryId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoriesService,
    private productService: ProductService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    // Get the subcategory ID from the route parameters
    this.subCategoryId = this.route.snapshot.paramMap.get('id') || '';

    if (this.subCategoryId) {
      this.subCategory$ = this.categoryService.getSpecificSubCategory(
        this.subCategoryId
      );

      // Fetch products from both pages and combine them
      this.products$ = forkJoin([
        this.productService.getAllProducts(1),
        this.productService.getAllProducts(2),
      ]).pipe(
        map(([page1, page2]) => {
          // Combine the data arrays from both pages
          return {
            data: [...page1.data, ...page2.data],
            metadata: page1.metadata,
            results: page1.results + page2.results,
          };
        })
      );
    }
  }

  hasProductsInSubcategory(products: any[]): boolean {
    if (!products || products.length === 0) {
      return false;
    }
    return products.some(
      (product) =>
        product.subcategory &&
        product.subcategory.some((sub: any) => sub._id === this.subCategoryId)
    );
  }

  isProductInSubcategory(product: any): boolean {
    return (
      product.subcategory &&
      product.subcategory.some((sub: any) => sub._id === this.subCategoryId)
    );
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

  goBack(): void {
    this.router.navigate(['/blank/categories']);
  }
}
