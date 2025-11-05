import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../services/category.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  templateUrl: './category-details.component.html',
})
export class CategoryDetailsComponent implements OnInit {
  category$!: Observable<any>;
  categoryId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoriesService
  ) {}

  ngOnInit(): void {
    // Get the category ID from the route parameters
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';

    if (this.categoryId) {
      this.category$ = this.categoryService.getCategoryById(this.categoryId);
    }
  }

  goBack(): void {
    this.router.navigate(['/blank/categories']);
  }
}
