import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressService } from '../../Core/services/address.service';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addresses.component.html',
})
export class AddressesComponent implements OnInit {
  addresses: any[] = [];
  isLoading: boolean = true;
  showAddForm: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  addressForm!: FormGroup;

  constructor(
    private addressService: AddressService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAddresses();
  }

  initForm(): void {
    this.addressForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      details: ['', [Validators.required, Validators.minLength(10)]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      city: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  loadAddresses(): void {
    this.isLoading = true;
    this.addressService.getLoggedUserAddresses().subscribe({
      next: (response) => {
        this.addresses = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading addresses:', error);
        this.errorMessage = 'Failed to load addresses';
        this.isLoading = false;
      }
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.addressForm.reset();
    }
    this.clearMessages();
  }

  onSubmitAddress(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.addressService.addAddress(this.addressForm.value).subscribe({
      next: (response) => {
        this.successMessage = 'Address added successfully!';
        this.loadAddresses();
        this.addressForm.reset();
        this.showAddForm = false;
        setTimeout(() => this.clearMessages(), 3000);
      },
      error: (error) => {
        console.error('Error adding address:', error);
        this.errorMessage = 'Failed to add address. Please try again.';
        setTimeout(() => this.clearMessages(), 3000);
      }
    });
  }

  removeAddress(addressId: string): void {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    this.addressService.removeAddress(addressId).subscribe({
      next: (response) => {
        this.successMessage = 'Address deleted successfully!';
        this.loadAddresses();
        setTimeout(() => this.clearMessages(), 3000);
      },
      error: (error) => {
        console.error('Error deleting address:', error);
        this.errorMessage = 'Failed to delete address. Please try again.';
        setTimeout(() => this.clearMessages(), 3000);
      }
    });
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
