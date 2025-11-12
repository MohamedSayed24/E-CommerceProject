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
  getCategoryBadgeColor(categoryName: string): 'red' | 'blue' | 'purple' | 'pink' | 'yellow' | 'green' | 'indigo' | 'gray' {
    const lowerCaseName = categoryName.toLowerCase();
    
    if (lowerCaseName.includes('women')) return 'red';
    if (lowerCaseName.includes('men')) return 'blue';
    if (lowerCaseName.includes('electronics')) return 'purple';
    if (lowerCaseName.includes('music')) return 'pink';
    if (lowerCaseName.includes('baby')) return 'yellow';
    if (lowerCaseName.includes('home')) return 'green';
    if (lowerCaseName.includes('books')) return 'indigo';
    return 'gray';
  }

  /**
   * Get subcategory badge color (complementary to category)
   */
  getSubcategoryBadgeColor(categoryName: string): 'red' | 'blue' | 'purple' | 'pink' | 'yellow' | 'green' | 'indigo' | 'gray' {
    const lowerCaseName = categoryName.toLowerCase();
    
    if (lowerCaseName.includes('women')) return 'pink';
    if (lowerCaseName.includes('men')) return 'indigo';
    if (lowerCaseName.includes('electronics')) return 'blue';
    if (lowerCaseName.includes('music')) return 'red';
    if (lowerCaseName.includes('baby')) return 'yellow';
    if (lowerCaseName.includes('home')) return 'green';
    if (lowerCaseName.includes('books')) return 'purple';
    return 'gray';
  }
}
