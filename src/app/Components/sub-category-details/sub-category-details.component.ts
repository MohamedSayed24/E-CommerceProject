import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { CategoriesService } from '../../services/category.service';

@Component({
  selector: 'app-sub-category-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sub-category-details.component.html'
})
export class SubCategoryDetailsComponent implements OnInit {
  subCategory$!: Observable<any>;
  subCategoryId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoriesService
  ) {}

  ngOnInit(): void {
    // Get the subcategory ID from the route parameters
    this.subCategoryId = this.route.snapshot.paramMap.get('id') || '';

    if (this.subCategoryId) {
      this.subCategory$ = this.categoryService.getSpecificSubCategory(this.subCategoryId);
    }
  }

  goBack(): void {
    this.router.navigate(['/blank/categories']);
  }
}
