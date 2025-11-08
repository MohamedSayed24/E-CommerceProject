import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [AsyncPipe, CommonModule],
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {
  product$!: Observable<any>;
  productId!: string;
  brandId!: string | null;
  selectedImage: string = '';
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (this.productId) {
      this.product$ = this.productService.getProductById(this.productId);
    }
    this.brandId = this.route.snapshot.paramMap.get('id') || null;
    if (this.brandId) {
      this.product$ = this.productService.getProductById(this.brandId);
    }
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    // Cart logic will be implemented later
    console.log(`Adding ${this.quantity} items to cart`);
  }

  goBack(): void {
    this.router.navigate(['/blank/categories']);
  }
}
