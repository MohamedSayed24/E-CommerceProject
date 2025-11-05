import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/category.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  categories$!: Observable<any>;

  constructor(private categoryService: CategoriesService) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();
  }
}
