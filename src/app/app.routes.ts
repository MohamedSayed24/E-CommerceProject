import { ForgetPasswordComponent } from './Components/forget-password/forget-password.component';
import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './Layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './Layouts/blank-layout/blank-layout.component';
import { NotfoundComponent } from './Components/notfound/notfound.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { HomeComponent } from './Components/home/home.component';
import { CategoriesComponent } from './Components/categories/categories.component';

import { BrandsComponent } from './Components/brands/brands.component';
import { CartComponent } from './Components/cart/cart.component';

import { VerifyCodeComponent } from './Components/verify-code/verify-code.component';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { PasswordResetGuard } from './Core/guards/password-reset.guard';

import { CategoryDetailsComponent } from './Components/CategoryDetails/category-details.component';
import { SubCategoryDetailsComponent } from './Components/sub-category-details/sub-category-details.component';
import { BranddetailsComponent } from './Components/branddetails/branddetails.component';

import { ProductComponent } from './Components/product/product.component';
import { WishlistComponent } from './Components/wishlist/wishlist.component';
import { AddressesComponent } from './Components/addresses/addresses.component';
import { CheckoutComponent } from './Components/checkout/checkout.component';
import { OrdersComponent } from './Components/orders/orders.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { AllProductsComponent } from './Components/all-products/all-products.component';
import { authGuard } from './Core/guards/auth-guard.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgotPasswords', component: ForgetPasswordComponent },
      {
        path: 'verify-code',
        component: VerifyCodeComponent,
        canActivate: [PasswordResetGuard],
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        canActivate: [PasswordResetGuard],
      },
    ],
  },
  {
    path: 'blank',
    component: BlankLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'categories/:id', component: CategoryDetailsComponent },

      { path: 'subcategories/:id', component: SubCategoryDetailsComponent },

      { path: 'products', component: AllProductsComponent },
      { path: 'products/:id', component: ProductComponent },

      { path: 'brands', component: BrandsComponent },
      { path: 'brands/:id', component: BranddetailsComponent },
      { path: 'cart', component: CartComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'addresses', component: AddressesComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'allorders', redirectTo: 'orders', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
    ],
    canActivate: [authGuard],
  },

  { path: '**', component: NotfoundComponent },
];
