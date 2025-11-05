import { ForgetPasswordComponent } from './Components/forget-password/forget-password.component';
import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './Layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './Layouts/blank-layout/blank-layout.component';
import { NotfoundComponent } from './Components/notfound/notfound.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { HomeComponent } from './Components/home/home.component';
import { CategoriesComponent } from './categories/categories.component';
import { BrandsComponent } from './brands/brands.component';
import { CartComponent } from './Components/cart/cart.component';
import { authGuard } from './auth/auth-guard.guard';
import { VerifyCodeComponent } from './Components/verify-code/verify-code.component';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { PasswordResetGuard } from './guards/password-reset.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      {path:'forgotPasswords',component:ForgetPasswordComponent},
      {path:'verify-code',component:VerifyCodeComponent,canActivate:[PasswordResetGuard]},
      {path:'reset-password',component:ResetPasswordComponent,canActivate:[PasswordResetGuard]}
    ],
  },
  {
    path: 'blank',
    component: BlankLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'brands', component: BrandsComponent },
      { path: 'cart', component: CartComponent },
    ],
    canActivate: [authGuard],
  },

  { path: '**', component: NotfoundComponent },
];
