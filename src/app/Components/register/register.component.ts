import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Core/services/auth.service';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule,ReactiveFormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registeredData : FormGroup = new FormGroup(
    {
    name:new FormControl(null,[Validators.required,Validators.minLength(3),Validators.maxLength(20)]),
    email: new FormControl(null,[Validators.required,Validators.email]),
    password: new FormControl(null,[Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]),
    rePassword: new FormControl(null),
    phone: new FormControl(null,[Validators.required,Validators.pattern('^01[0125][0-9]{8}$')]),
  }
   , this.confirmPassword)  ;
  
  confirmPassword(formGroup : AbstractControl)
  {
    if(formGroup.get('password')?.value === formGroup.get('rePassword')?.value)
    {
      return null;
    
    }
    return {missMatch : true};
  }
  
  errorMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onRegisterSubmit(): void {
    if(this.registeredData.valid)
    {

      this.authService.register(this.registeredData.value).subscribe({
        next: (response) => {
          // Success: Token stored, now redirect the user to a protected page
          this.router.navigate(['/blank']);
        },
        error: (err) => {
          // Failure: Display error message from the backend
          this.errorMessage =
            err.error.message || 'Login failed. Check your credentials.';
        },
      });
      
    }
  }
}
