import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../Core/services/category.service';
import { SubCategoriesComponent } from '../sub-categories/sub-categories.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductService } from '../../Core/services/product.service';
import { WishlistService } from '../../Core/services/wishlist.service';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [AsyncPipe, SubCategoriesComponent, RouterLink],
  templateUrl: './category-details.component.html',
})
export class CategoryDetailsComponent implements OnInit {
  category$!: Observable<any>;
  categoryId!: string;
  products$!: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoriesService,
    private productService: ProductService,
    private wishlistService: WishlistService
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
