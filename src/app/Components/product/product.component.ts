import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ProductService } from '../../Core/services/product.service';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CartService } from '../../Core/services/cart.service';

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
  isAddingToCart: boolean = false;
  addToCartMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
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
    if (!this.productId || this.isAddingToCart) {
      return;
    }

    this.isAddingToCart = true;
    this.addToCartMessage = '';

    this.cartService.addProductToCart(this.productId).subscribe({
      next: (response) => {
        this.isAddingToCart = false;
        this.addToCartMessage = 'Product added to cart successfully!';
        console.log('Added to cart:', response);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.addToCartMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.isAddingToCart = false;
        this.addToCartMessage = 'Failed to add product to cart';
        console.error('Error adding to cart:', error);
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          this.addToCartMessage = '';
        }, 3000);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/blank/categories']);
  }
}
