import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../Core/services/cart.service';
import { WishlistService } from '../../Core/services/wishlist.service';
import { ToastService } from '../../Core/services/toast.service';
import { IProduct } from '../../Core/Interfaces/iproduct';

@Component({
  selector: 'app-product-quick-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-quick-view.component.html',
  styleUrls: ['./product-quick-view.component.css'],
})
export class ProductQuickViewComponent implements OnInit {
  @Input() product: IProduct | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() viewDetails = new EventEmitter<string>();

  selectedImage: string = '';
  quantity: number = 1;
  isAddingToCart = false;
  isAddingToWishlist = false;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    if (this.product) {
      this.selectedImage = this.product.imageCover;
    }
  }

  ngOnChanges(): void {
    if (this.product) {
      this.selectedImage = this.product.imageCover;
      this.quantity = 1;
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  incrementQuantity(): void {
    if (
      this.product &&
      this.product.quantity &&
      this.quantity < this.product.quantity
    ) {
      this.quantity++;
    } else {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    this.isAddingToCart = true;
    this.cartService.addProductToCart(this.product._id).subscribe({
      next: () => {
        this.isAddingToCart = false;
        this.toastService.success('Product added to cart!');
      },
      error: (error) => {
        this.isAddingToCart = false;
        console.error('Error adding to cart:', error);
        this.toastService.error('Failed to add to cart');
      },
    });
  }

  addToWishlist(): void {
    if (!this.product) return;

    this.isAddingToWishlist = true;
    this.wishlistService.addToWishlist(this.product._id).subscribe({
      next: () => {
        this.isAddingToWishlist = false;
        this.toastService.success('Added to wishlist!');
      },
      error: (error) => {
        this.isAddingToWishlist = false;
        console.error('Error adding to wishlist:', error);
        this.toastService.error('Failed to add to wishlist');
      },
    });
  }

  onViewDetails(): void {
    if (this.product) {
      this.viewDetails.emit(this.product._id);
      this.onClose();
    }
  }

  getStarArray(rating: number): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, index) => index < Math.round(rating));
  }

  getDiscountPercentage(): number {
    if (this.product?.priceAfterDiscount) {
      return Math.round(
        ((this.product.price - this.product.priceAfterDiscount) /
          this.product.price) *
          100
      );
    }
    return 0;
  }
}
