import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';


export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  // Use the inject function to get instances of services in functional code
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Check if the user is authenticated
  if (authService.isAuthenticated()) {
    return true; // Navigation is allowed
  } else {
    // 2. If not authenticated, redirect to the login page
    // Optional: Pass the intended URL so the user can be sent back after logging in
    console.log('Access denied. Redirecting to login.');
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }
};
