import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Product {
  _id: string;
  title: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  category?: {
    _id: string;
    name: string;
  };
  brand?: {
    _id: string;
    name: string;
  };
  subcategory?: Array<{
    _id: string;
    name: string;
  }>;
  description?: string;
  quantity?: number;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() isAddingToCart: boolean = false;

  @Output() addToCartClick = new EventEmitter<string>();
  @Output() addToWishlistClick = new EventEmitter<string>();
  @Output() viewDetailsClick = new EventEmitter<string>();

  Math = Math;

  constructor(private router: Router) {}

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.addToCartClick.emit(this.product._id);
  }

  onAddToWishlist(event: Event): void {
    event.stopPropagation();
    this.addToWishlistClick.emit(this.product._id);
  }

  onViewDetails(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.viewDetailsClick.emit(this.product._id);
  }

  /**
   * Get category badge color based on category name
   */
  getCategoryBadgeColor(categoryName: string): string {
    const lowerCaseName = categoryName.toLowerCase();
    
    if (lowerCaseName.includes('women')) {
      return 'bg-red-100 text-red-700';
    } else if (lowerCaseName.includes('men')) {
      return 'bg-blue-100 text-blue-700';
    } else if (lowerCaseName.includes('electronics')) {
      return 'bg-purple-100 text-purple-700';
    } else if (lowerCaseName.includes('music')) {
      return 'bg-pink-100 text-pink-700';
    } else if (lowerCaseName.includes('baby')) {
      return 'bg-yellow-100 text-yellow-700';
    } else if (lowerCaseName.includes('home')) {
      return 'bg-green-100 text-green-700';
    } else if (lowerCaseName.includes('books')) {
      return 'bg-indigo-100 text-indigo-700';
    } else {
      return 'bg-gray-100 text-gray-700';
    }
  }

  /**
   * Get subcategory badge color (complementary to category)
   */
  getSubcategoryBadgeColor(categoryName: string): string {
    const lowerCaseName = categoryName.toLowerCase();
    
    if (lowerCaseName.includes('women')) {
      return 'bg-orange-100 text-orange-700';
    } else if (lowerCaseName.includes('men')) {
      return 'bg-cyan-100 text-cyan-700';
    } else if (lowerCaseName.includes('electronics')) {
      return 'bg-violet-100 text-violet-700';
    } else if (lowerCaseName.includes('music')) {
      return 'bg-rose-100 text-rose-700';
    } else if (lowerCaseName.includes('baby')) {
      return 'bg-amber-100 text-amber-700';
    } else if (lowerCaseName.includes('home')) {
      return 'bg-emerald-100 text-emerald-700';
    } else if (lowerCaseName.includes('books')) {
      return 'bg-sky-100 text-sky-700';
    } else {
      return 'bg-slate-100 text-slate-700';
    }
  }
}
