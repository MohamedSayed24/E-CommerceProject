// home.component.ts
import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { interval, Subscription, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoriesService } from '../../Core/services/category.service';
import { ProductService } from '../../Core/services/product.service';
import { CartService } from '../../Core/services/cart.service';
import { WishlistService } from '../../Core/services/wishlist.service';
import { ProductQuickViewComponent } from '../product-quick-view/product-quick-view.component';

// Services


// Register Swiper
register();

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  sold?: number;
}

interface FlashSaleProduct extends Product {
  discountPercentage: number;
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductQuickViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  // Categories for Sidenav
  categories: Category[] = [];
  isLoadingCategories = true;

  // Hero Banners
  banners = [
    {
      image: 'home1.png',
      title: 'iPhone 14 Series',
      subtitle: 'Up to 10% off Voucher',
      link: '/blank/products',
      buttonText: 'Shop Now'
    },
    {
      image: 'home2.png',
      title: 'Summer Collection',
      subtitle: 'Up to 30% off',
      link: '/blank/products',
      buttonText: 'Shop Now'
    },
    {
      image: 'home4.png',
      title: 'New Arrivals',
      subtitle: 'Latest Fashion Trends',
      link: '/blank/products',
      buttonText: 'Explore Now'
    }
  ];

  // Flash Sales
  flashSaleProducts: FlashSaleProduct[] = [];
  isLoadingFlashSales = true;

  // Best Selling Products
  bestSellingProducts: FlashSaleProduct[] = [];
  isLoadingBestSelling = true;

  // Explore Our Products
  exploreProducts: FlashSaleProduct[] = [];
  isLoadingExploreProducts = true;

  // Quick View Modal
  isQuickViewOpen = false;
  selectedProductForQuickView: Product | null = null;

  // Countdown Timer
  countdown: CountdownTime = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  private countdownSubscription?: Subscription;
  private flashSaleEndTime!: Date;

  constructor(
    private categoryService: CategoriesService,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadFlashSaleProducts();
    this.loadBestSellingProducts();
    this.loadExploreProducts();
    this.initializeCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  // ========================================
  // CATEGORIES
  // ========================================
  loadCategories(): void {
    this.isLoadingCategories = true;
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        this.isLoadingCategories = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoadingCategories = false;
      }
    });
  }

  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/blank/categories', categoryId]);
  }

  // ========================================
  // FLASH SALES
  // ========================================
  loadFlashSaleProducts(): void {
    this.isLoadingFlashSales = true;
    
    // Fetch products from both pages to get all products
    forkJoin([
      this.productService.getAllProducts(1),
      this.productService.getAllProducts(2)
    ]).pipe(
      map(([page1, page2]: [any, any]) => {
        // Combine all products from both pages
        return [...page1.data, ...page2.data];
      })
    ).subscribe({
      next: (allProducts: Product[]) => {
        // Shuffle the products array to get random products
        const shuffledProducts = this.shuffleArray(allProducts);
        
        // Take the first 12-15 random products
        this.flashSaleProducts = shuffledProducts.slice(0, 15).map((product: Product) => {
          // Calculate discount percentage if exists
          const discountPercentage = product.priceAfterDiscount 
            ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)
            : 0;
          return {
            ...product,
            discountPercentage
          };
        });

        this.isLoadingFlashSales = false;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.isLoadingFlashSales = false;
      }
    });
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // ========================================
  // BEST SELLING PRODUCTS
  // ========================================
  loadBestSellingProducts(): void {
    this.isLoadingBestSelling = true;
    
    // Fetch products from both pages
    forkJoin([
      this.productService.getAllProducts(1),
      this.productService.getAllProducts(2)
    ]).pipe(
      map(([page1, page2]: [any, any]) => {
        // Combine all products from both pages
        const allProducts = [...page1.data, ...page2.data];
        
        // Filter products that have discounts (priceAfterDiscount exists)
        return allProducts.filter((product: Product) => product.priceAfterDiscount);
      })
    ).subscribe({
      next: (discountedProducts: Product[]) => {
        // Map products with discount percentage
        this.bestSellingProducts = discountedProducts.map((product: Product) => {
          const discountPercentage = product.priceAfterDiscount 
            ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)
            : 0;
          return {
            ...product,
            discountPercentage
          };
        });

        this.isLoadingBestSelling = false;
      },
      error: (error: any) => {
        console.error('Error loading best selling products:', error);
        this.isLoadingBestSelling = false;
      }
    });
  }

  // ========================================
  // EXPLORE OUR PRODUCTS
  // ========================================
  loadExploreProducts(): void {
    this.isLoadingExploreProducts = true;
    
    // Fetch products from both pages
    forkJoin([
      this.productService.getAllProducts(1),
      this.productService.getAllProducts(2)
    ]).pipe(
      map(([page1, page2]: [any, any]) => {
        // Combine all products from both pages
        return [...page1.data, ...page2.data];
      })
    ).subscribe({
      next: (allProducts: Product[]) => {
        // Shuffle the products array to get random products
        const shuffledProducts = this.shuffleArray(allProducts);
        
        // Take the first 12 random products
        this.exploreProducts = shuffledProducts.slice(0, 12).map((product: Product) => {
          const discountPercentage = product.priceAfterDiscount 
            ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)
            : 0;
          return {
            ...product,
            discountPercentage
          };
        });

        this.isLoadingExploreProducts = false;
      },
      error: (error: any) => {
        console.error('Error loading explore products:', error);
        this.isLoadingExploreProducts = false;
      }
    });
  }

  // ========================================
  // COUNTDOWN TIMER
  // ========================================
  initializeCountdown(): void {
    // Set flash sale end time to midnight (end of today)
    this.flashSaleEndTime = new Date();
    this.flashSaleEndTime.setHours(23, 59, 59, 999);

    // Update countdown every second
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.updateCountdown();
    });

    // Initial update
    this.updateCountdown();
  }

  updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.flashSaleEndTime.getTime() - now;

    if (distance < 0) {
      // Flash sale ended, reset to next day midnight
      this.flashSaleEndTime = new Date();
      this.flashSaleEndTime.setDate(this.flashSaleEndTime.getDate() + 1);
      this.flashSaleEndTime.setHours(0, 0, 0, 0);
      return;
    }

    this.countdown = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    };
  }

  // ========================================
  // PRODUCT ACTIONS
  // ========================================
  addToCart(productId: string, event: Event): void {
    event.stopPropagation();
    this.cartService.addProductToCart(productId).subscribe({
      next: () => {
        alert('Product added to cart!');
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        alert('Failed to add to cart');
      }
    });
  }

  addToWishlist(productId: string, event: Event): void {
    event.stopPropagation();
    this.wishlistService.addToWishlist(productId).subscribe({
      next: () => {
        alert('Added to wishlist!');
      },
      error: (error) => {
        console.error('Error adding to wishlist:', error);
        alert('Failed to add to wishlist');
      }
    });
  }

  viewProductDetails(productId: string): void {
    this.router.navigate(['/blank/products', productId]);
  }

  viewAllProducts(): void {
    this.router.navigate(['/blank/products']);
  }

  // ========================================
  // QUICK VIEW MODAL
  // ========================================
  openQuickView(product: Product, event: Event): void {
    event.stopPropagation();
    this.selectedProductForQuickView = product;
    this.isQuickViewOpen = true;
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeQuickView(): void {
    this.isQuickViewOpen = false;
    this.selectedProductForQuickView = null;
    // Restore body scroll
    document.body.style.overflow = '';
  }

  onQuickViewDetails(productId: string): void {
    this.router.navigate(['/blank/products', productId]);
  }

  // Helper: Format number with leading zero
  formatNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  // Helper: Generate star array for ratings
  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < Math.round(rating));
  }
}
