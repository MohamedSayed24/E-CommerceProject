import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AddressService } from '../../Core/services/address.service';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addresses.component.html',
})
export class AddressesComponent implements OnInit {
  addresses: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showAddForm: boolean = false;

  addressForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    details: new FormControl('', [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/),
    ]),
    city: new FormControl('', [Validators.required]),
  });

  constructor(private addressService: AddressService) {}

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.addressService.getLoggedUserAddresses().subscribe({
      next: (response) => {
        this.addresses = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading addresses:', error);
        this.errorMessage = 'Failed to load addresses. Please try again.';
        this.isLoading = false;
      },
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.addressForm.reset();
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  onSubmitAddress(): void {
    if (this.addressForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.addressService.addAddress(this.addressForm.value).subscribe({
        next: (response) => {
          console.log('Address added:', response);
          this.successMessage = 'Address added successfully!';
          this.addressForm.reset();
          this.showAddForm = false;
          this.loadAddresses(); // Reload addresses
          this.isLoading = false;

          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error('Error adding address:', error);
          this.errorMessage =
            error.error?.message || 'Failed to add address. Please try again.';
          this.isLoading = false;
        },
      });
    }
  }

  removeAddress(addressId: string): void {
    if (confirm('Are you sure you want to delete this address?')) {
      this.addressService.removeAddress(addressId).subscribe({
        next: (response) => {
          console.log('Address removed:', response);
          this.successMessage = 'Address removed successfully!';
          this.loadAddresses(); // Reload addresses

          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error('Error removing address:', error);
          this.errorMessage = 'Failed to remove address. Please try again.';
        },
      });
    }
  }
}
