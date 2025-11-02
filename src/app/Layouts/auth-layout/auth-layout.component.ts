import { Component } from '@angular/core';
import { NavAuthComponent } from "../../Components/nav-auth/nav-auth.component";
import { FooterComponent } from "../../Components/footer/footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [NavAuthComponent, RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {

}
