import { Component, OnInit, Input } from '@angular/core';
import { CategoriesService } from '../../Core/services/category.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sub-categories',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sub-categories.component.html'
})
export class SubCategoriesComponent implements OnInit {
  @Input() categoryId: string = '';
  
  constructor(private _CategoryService:CategoriesService) { 
  }
  subCategoriesList:any[] = [];
  
  ngOnInit(): void {
    if (this.categoryId) {
      // Fetch subcategories for a specific category
      this._CategoryService.getAllSubCategoriesOfCategory(this.categoryId).subscribe({
        next:(response)=>{
          this.subCategoriesList = response.data;
        },
        error:(err)=>{
          console.log(err);
        }
      });
    } else {
      // Fetch all subcategories if no category ID is provided
      this._CategoryService.getAllSubCategories().subscribe({
        next:(response)=>{
          this.subCategoriesList = response.data;
        },
        error:(err)=>{
          console.log(err);
        }
      });
    }
  }
}
