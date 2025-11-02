import { Component } from '@angular/core';
import { NavBlankComponent } from "../../Components/nav-blank/nav-blank.component";

@Component({
  selector: 'app-blank-layout',
  standalone: true,
  imports: [NavBlankComponent],
  templateUrl: './blank-layout.component.html',
  styleUrl: './blank-layout.component.css'
})
export class BlankLayoutComponent {

}
