import {
  Component,
  OnInit,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ProductService } from '../../Core/services/product.service';
import { Observable, Subscription } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CartService } from '../../Core/services/cart.service';
import { WishlistService } from '../../Core/services/wishlist.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { register } from 'swiper/element/bundle';
import { ToastService } from '../../Core/services/toast.service';
import { IProduct } from '../../Core/Interfaces/iproduct';

// Register Swiper
register();

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [AsyncPipe, CommonModule, ProductCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit, OnDestroy {
  product$!: Observable<any>;
  productId!: string;
  brandId!: string | null;
  selectedImage: string = '';
  quantity: number = 1;
  isAddingToCart: boolean = false;
  addToCartMessage: string = '';

  // Related Products
  relatedProducts: IProduct[] = [];
  isLoadingRelatedProducts: boolean = false;

  // Subscriptions for cleanup
  private loadRelatedProductsSubscription!: Subscription;
  private loadRelatedProductsCategorySubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastService: ToastService
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

  ngOnDestroy(): void {
    this.loadRelatedProductsSubscription?.unsubscribe();
    this.loadRelatedProductsCategorySubscription?.unsubscribe();
  }

  loadRelatedProducts(): void {
    this.isLoadingRelatedProducts = true;

    // First get the current product to get its category
    this.loadRelatedProductsCategorySubscription = this.productService
      .getProductById(this.productId)
      .subscribe({
        next: (productData) => {
          const categoryId = productData.data.category._id;

          // Get all products from the same category
          this.loadRelatedProductsSubscription = this.productService
            .getAllProducts(1)
            .subscribe({
              next: (response) => {
                // Filter products from same category, exclude current product, take first 8
                this.relatedProducts = response.data
                  .filter(
                    (p: IProduct) =>
                      p.category._id === categoryId && p._id !== this.productId
                  )
                  .slice(0, 8);

                this.isLoadingRelatedProducts = false;
              },
              error: (error) => {
                console.error('Error loading related products:', error);
                this.isLoadingRelatedProducts = false;
              },
            });
        },
        error: (error) => {
          console.error('Error loading product category:', error);
          this.isLoadingRelatedProducts = false;
        },
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

    this.cartService.addProductToCart(id).subscribe({
      next: (response) => {
        this.isAddingToCart = false;
        this.toastService.success('Product added to cart successfully!');
        console.log('Added to cart:', response);
      },
      error: (error) => {
        this.isAddingToCart = false;
        this.toastService.error('Failed to add product to cart');
        console.error('Error adding to cart:', error);
      },
    });
  }

  addToWishlist(productId: string): void {
    this.wishlistService.addToWishlist(productId).subscribe({
      next: (response: any) => {
        this.toastService.success('Added to wishlist!');
        console.log('Added to wishlist:', response);
      },
      error: (error: any) => {
        this.toastService.error('Failed to add to wishlist');
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
}
