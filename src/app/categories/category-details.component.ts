import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './category-details.component.html',
})
export class CategoryDetailsComponent implements OnInit {
  products$!: Observable<any>;
  categoryId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Get the category ID from the route parameters
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';

    if (this.categoryId) {
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
