import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ProductService } from '../../Core/services/product.service';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CartService } from '../../Core/services/cart.service';
import { WishlistService } from '../../Core/services/wishlist.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { register } from 'swiper/element/bundle';

// Register Swiper
register();

interface Product {
  _id: string;
  title: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  category: { _id: string; name: string };
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [AsyncPipe, CommonModule, ProductCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
  
  // Related Products
  relatedProducts: Product[] = [];
  isLoadingRelatedProducts: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (this.productId) {
      this.product$ = this.productService.getProductById(this.productId);
      
      // Load related products
      this.loadRelatedProducts();
    }
    this.brandId = this.route.snapshot.paramMap.get('id') || null;
    if (this.brandId) {
      this.product$ = this.productService.getProductById(this.brandId);
    }
  }
  
  loadRelatedProducts(): void {
    this.isLoadingRelatedProducts = true;
    
    // First get the current product to get its category
    this.productService.getProductById(this.productId).subscribe({
      next: (productData) => {
        const categoryId = productData.data.category._id;
        
        // Get all products from the same category
        this.productService.getAllProducts(1).subscribe({
          next: (response) => {
            // Filter products from same category, exclude current product, take first 8
            this.relatedProducts = response.data
              .filter((p: Product) => 
                p.category._id === categoryId && p._id !== this.productId
              )
              .slice(0, 8);
            
            this.isLoadingRelatedProducts = false;
          },
          error: (error) => {
            console.error('Error loading related products:', error);
            this.isLoadingRelatedProducts = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading product category:', error);
        this.isLoadingRelatedProducts = false;
      }
    });
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

  addToCart(productId?: string): void {
    const id = productId || this.productId;
    if (!id || this.isAddingToCart) {
      return;
    }

    this.isAddingToCart = true;
    this.addToCartMessage = '';

    this.cartService.addProductToCart(id).subscribe({
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

  addToWishlist(productId: string): void {
    this.wishlistService.addToWishlist(productId).subscribe({
      next: (response: any) => {
        console.log('Added to wishlist:', response);
      },
      error: (error: any) => {
        console.error('Error adding to wishlist:', error);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/blank/categories']);
  }
  
  viewProductDetails(productId: string): void {
    this.router.navigate(['/blank/products', productId]).then(() => {
      // Reload component when navigating to another product
      window.location.reload();
    });
  }
  
  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < Math.round(rating));
  }
}
