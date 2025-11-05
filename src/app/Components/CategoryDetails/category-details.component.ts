import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/category.service';
import { SubCategoriesComponent } from "../sub-categories/sub-categories.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ProductService } from '../../services/product.service';

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
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Get the category ID from the route parameters
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';

    if (this.categoryId) {
      // Initialize category data
      this.category$ = this.categoryService.getCategoryById(this.categoryId);
      // Get all products
      this.products$ = this.productService.getAllProducts();
    }
  }

  hasProductsInCategory(products: any[]): boolean {
    if (!products || products.length === 0) {
      return false;
    }
    return products.some((product) => product.category._id === this.categoryId);
  }

  goBack(): void {
    this.router.navigate(['/blank/categories']);
  }
}
