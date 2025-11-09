import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  subscriptionEmail: string = '';
  currentYear: number = new Date().getFullYear();

  // Social media links
  socialLinks = {
    facebook: '#',
    github: 'https://github.com/MohamedSayed24',
    instagram: '#',
    linkedin: 'https://www.linkedin.com/in/mohamed-el-sayed-414089222/'
  };

  onSubscribe(): void {
    if (this.subscriptionEmail) {
      console.log('Subscribing email:', this.subscriptionEmail);
      // Add your subscription logic here
      this.subscriptionEmail = '';
    }
  }
}