# Authentication System Documentation

## Overview

This E-Commerce project implements a comprehensive JWT-based authentication system using Angular's modern standalone components and functional approach. The authentication flow includes user registration, login, token management, HTTP request interception, and route protection.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Authentication Flow](#authentication-flow)
3. [Core Components](#core-components)
4. [API Integration](#api-integration)
5. [Security Features](#security-features)
6. [User Journey](#user-journey)
7. [Code Examples](#code-examples)

---

## Architecture Overview

### Technology Stack

- **Angular**: Standalone Components (Modern Angular Architecture)
- **HTTP Client**: For API communication
- **RxJS**: Reactive programming for async operations
- **JWT Tokens**: JSON Web Tokens for authentication
- **LocalStorage**: Client-side token persistence
- **Functional Guards**: Route protection using `CanActivateFn`
- **Functional Interceptors**: HTTP request interception using `HttpInterceptorFn`

### Key Files Structure

```
src/app/
├── services/
│   └── auth.service.ts                 # Authentication business logic
├── interceptors/
│   └── auth.interceptor.ts             # HTTP request interceptor
├── auth/
│   └── auth-guard.guard.ts             # Route guard for protected routes
├── Components/
│   ├── login/
│   │   ├── login.component.ts          # Login component logic
│   │   └── login.component.html        # Login form UI
│   └── register/
│       ├── register.component.ts       # Registration component logic
│       └── register.component.html     # Registration form UI
├── Layouts/
│   ├── auth-layout/                    # Layout for auth pages
│   └── blank-layout/                   # Layout for protected pages
├── app.config.ts                       # Application configuration
└── app.routes.ts                       # Route definitions
```

---

## Authentication Flow

### 1. Registration Flow

```
User fills registration form
    ↓
RegisterComponent captures data (name, email, password, rePassword, phone)
    ↓
AuthService.register() called with user data
    ↓
HTTP POST to: https://ecommerce.routemisr.com/api/v1/auth/signup
    ↓
Backend validates and creates user account
    ↓
Backend returns JWT token
    ↓
Token stored in localStorage (key: 'authToken')
    ↓
User redirected to '/blank' (protected area)
    ↓
AuthGuard validates token
    ↓
User accesses protected routes
```

### 2. Login Flow

```
User enters email and password
    ↓
LoginComponent captures credentials
    ↓
AuthService.login() called with credentials
    ↓
HTTP POST to: https://ecommerce.routemisr.com/api/v1/auth/signin
    ↓
Backend validates credentials
    ↓
Backend returns JWT token
    ↓
Token stored in localStorage (key: 'authToken')
    ↓
User redirected to '/blank/home'
    ↓
AuthGuard validates token
    ↓
User accesses protected routes
```

### 3. Authenticated Request Flow

```
User makes HTTP request (e.g., fetch products)
    ↓
AuthInterceptor intercepts the request
    ↓
Retrieves token from localStorage
    ↓
If token exists:
    - Clones request
    - Adds Authorization header: "Bearer <token>"
    - Forwards modified request
    ↓
Backend receives authenticated request
    ↓
Backend validates token and processes request
    ↓
Response returned to component
```

### 4. Route Protection Flow

```
User attempts to navigate to protected route
    ↓
AuthGuard (canActivate) is triggered
    ↓
Calls AuthService.isAuthenticated()
    ↓
Checks if token exists in localStorage
    ↓
If authenticated (token exists):
    - Returns true
    - Navigation allowed
    ↓
If not authenticated (no token):
    - Returns router.createUrlTree(['/login'])
    - User redirected to login page
    - Original URL saved in query params (returnUrl)
```

### 5. Logout Flow

```
User clicks logout
    ↓
AuthService.logout() called
    ↓
Token removed from localStorage
    ↓
User redirected to login page
    ↓
Subsequent requests have no Authorization header
    ↓
AuthGuard blocks access to protected routes
```

---

## Core Components

### 1. AuthService (`auth.service.ts`)

**Purpose**: Central authentication business logic service

**Key Responsibilities**:

- Handle login and registration API calls
- Store and manage JWT tokens
- Provide authentication state checking
- Handle logout operations

**API Endpoints**:

- Base URL: `https://ecommerce.routemisr.com/api/v1/auth`
- Login: `POST /signin`
- Register: `POST /signup`

**Methods**:

#### `login(credentials: any): Observable<any>`

- Sends user credentials to backend
- Uses RxJS `tap` operator to store token on success
- Returns Observable for component subscription
- Credentials format: `{ email: string, password: string }`

#### `register(userData: any): Observable<any>`

- Sends registration data to backend
- Automatically stores token if returned
- Returns Observable for component subscription
- User data format: `{ name: string, email: string, password: string, rePassword: string, phone: string }`

#### `storeToken(token: string): void`

- Private method to store JWT in localStorage
- Storage key: `'authToken'`

#### `logout(): void`

- Removes token from localStorage
- Clears authentication state

#### `isAuthenticated(): boolean`

- Checks if user has valid token
- Returns `true` if token exists in localStorage
- Returns `false` otherwise
- **Note**: Currently doesn't validate token expiration (can be enhanced)

**Code Example**:

```typescript
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly API_URL = "https://ecommerce.routemisr.com/api/v1/auth";
  private readonly TOKEN_KEY = "authToken";

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.API_URL}/signin`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.storeToken(response.token);
        }
      })
    );
  }

  // ... other methods
}
```

---

### 2. AuthInterceptor (`auth.interceptor.ts`)

**Purpose**: Automatically attach JWT tokens to outgoing HTTP requests

**Type**: Functional Interceptor (`HttpInterceptorFn`)

**How It Works**:

1. Intercepts every HTTP request made by the application
2. Retrieves JWT token from localStorage
3. If token exists, clones the request and adds `Authorization` header
4. Format: `Authorization: Bearer <token>`
5. Forwards the modified request to the next handler

**Benefits**:

- Centralized token attachment logic
- No need to manually add headers in each service
- Cleaner component and service code
- Consistent authentication across all API calls

**Code Example**:

```typescript
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem("authToken");

  if (authToken) {
    const cloned = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${authToken}`),
    });
    return next(cloned);
  }

  return next(req);
};
```

**Registration**: Configured in `app.config.ts`:

```typescript
provideHttpClient(withInterceptors([AuthInterceptor]));
```

---

### 3. AuthGuard (`auth-guard.guard.ts`)

**Purpose**: Protect routes from unauthorized access

**Type**: Functional Guard (`CanActivateFn`)

**How It Works**:

1. Triggered before route activation
2. Injects `AuthService` and `Router` using Angular's `inject()` function
3. Checks authentication status via `authService.isAuthenticated()`
4. If authenticated: allows navigation (returns `true`)
5. If not authenticated:
   - Redirects to `/login`
   - Preserves intended URL in `returnUrl` query parameter
   - Returns `UrlTree` for redirection

**Benefits**:

- Prevents unauthorized access to protected routes
- Preserves user's intended destination
- Can redirect back after successful login
- Functional approach (modern Angular pattern)

**Code Example**:

```typescript
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    console.log("Access denied. Redirecting to login.");
    return router.createUrlTree(["/login"], {
      queryParams: { returnUrl: state.url },
    });
  }
};
```

**Usage in Routes**:

```typescript
{
  path: 'blank',
  component: BlankLayoutComponent,
  canActivate: [authGuard],  // Guard applied here
  children: [...]
}
```

---

### 4. LoginComponent

**Purpose**: Handle user login interface and logic

**Template Features**:

- Email input field (type: email, name: "email")
- Password input field (type: password, name: "password")
- Two-way data binding using `[(ngModel)]`
- Form submission with `(submit)` event
- Error message display
- Link to registration page

**Component Logic**:

```typescript
export class LoginComponent {
  credentials = { email: "", password: "" };
  errorMessage: string = "";

  constructor(private authService: AuthService, private router: Router) {}

  onLoginSubmit(): void {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        // Token automatically stored by service
        this.router.navigate(["/blank"]);
      },
      error: (err) => {
        this.errorMessage = err.error.message || "Login failed. Check your credentials.";
      },
    });
  }
}
```

**Key Points**:

- Uses Angular's `FormsModule` for template-driven forms
- Standalone component (no NgModule required)
- Reactive error handling with RxJS
- Automatic token storage via AuthService
- Navigation to protected area on success

---

### 5. RegisterComponent

**Purpose**: Handle user registration interface and logic

**Template Features**:

- Full name input field
- Email input field
- Phone number input field
- Password input field
- Confirm password input field (rePassword)
- Form submission with `(submit)` event
- Error message display
- Link to login page

**Component Logic**:

```typescript
export class RegisterComponent {
  registeredData = {
    name: "",
    email: "",
    password: "",
    rePassword: "",
    phone: "",
  };
  errorMessage: string = "";

  constructor(private authService: AuthService, private router: Router) {}

  onRegisterSubmit(): void {
    this.authService.register(this.registeredData).subscribe({
      next: (response) => {
        // Token automatically stored by service
        this.router.navigate(["/blank"]);
      },
      error: (err) => {
        this.errorMessage = err.error.message || "Registration failed.";
      },
    });
  }
}
```

**Key Points**:

- Collects comprehensive user information
- Password confirmation field (rePassword)
- Automatic login after successful registration
- Error handling and user feedback

---

## API Integration

### Backend API Details

**Base URL**: `https://ecommerce.routemisr.com/api/v1/auth`

### 1. Login Endpoint

**Endpoint**: `POST /signin`

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "userPassword123"
}
```

**Success Response** (200):

```json
{
  "message": "success",
  "user": {
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response** (401):

```json
{
  "message": "Incorrect email or password"
}
```

---

### 2. Registration Endpoint

**Endpoint**: `POST /signup`

**Request Body**:

```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "userPassword123",
  "rePassword": "userPassword123",
  "phone": "01234567891"
}
```

**Success Response** (201):

```json
{
  "message": "success",
  "user": {
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response** (400):

```json
{
  "message": "Email already exists"
}
```

---

### 3. Authenticated Requests

All subsequent API calls to protected endpoints should include:

**Headers**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

This is automatically handled by the `AuthInterceptor`.

---

## Security Features

### 1. Token Storage

- **Location**: Browser's localStorage
- **Key**: `'authToken'`
- **Format**: JWT (JSON Web Token)

**Considerations**:

- ✅ Persists across browser sessions
- ✅ Easy to implement and access
- ⚠️ Vulnerable to XSS attacks (requires additional security measures)
- 💡 **Future Enhancement**: Consider using httpOnly cookies for enhanced security

---

### 2. HTTP Interceptor

- Automatically adds Authorization header to all requests
- Centralized token management
- No manual header configuration needed

---

### 3. Route Guards

- Prevents unauthorized access to protected routes
- Validates authentication before route activation
- Redirects unauthenticated users to login

---

### 4. Error Handling

- Graceful error messages for failed authentication
- User-friendly feedback
- Prevents exposure of sensitive error details

---

### 5. Password Security

- Passwords sent over HTTPS
- Not stored on client side
- Confirmation field for registration (rePassword)

---

## User Journey

### New User Registration Journey

1. **Landing Page**: User arrives at application (redirects to `/login`)
2. **Navigate to Register**: Click "Sign up" link
3. **Fill Registration Form**:
   - Full Name
   - Email Address
   - Phone Number
   - Password
   - Confirm Password
4. **Submit Form**: Click "Sign In" button (note: button text should say "Sign Up")
5. **Backend Processing**:
   - Validates email uniqueness
   - Validates password match
   - Creates user account
   - Generates JWT token
6. **Automatic Login**: Token stored in localStorage
7. **Redirect**: Navigated to `/blank/home`
8. **Access Granted**: Can now access all protected routes

---

### Returning User Login Journey

1. **Landing Page**: User arrives at `/login`
2. **Fill Login Form**:
   - Email Address
   - Password
3. **Submit Form**: Click "Sign In" button
4. **Backend Validation**:
   - Verifies credentials
   - Generates JWT token
5. **Token Storage**: Stored in localStorage
6. **Redirect**: Navigated to `/blank/home`
7. **Session Active**: All subsequent requests include token

---

### Protected Route Access

1. **User Clicks Protected Link**: e.g., Categories, Brands, Cart
2. **AuthGuard Activates**: Checks `isAuthenticated()`
3. **If Authenticated**:
   - Route loads successfully
   - Content displayed
4. **If Not Authenticated**:
   - Redirected to `/login`
   - Original URL saved as `returnUrl`
   - After login, can redirect back to intended page

---

### Logout Journey

1. **User Clicks Logout**: (implementation needed in nav-blank component)
2. **AuthService.logout() Called**: Token removed from localStorage
3. **Redirect to Login**: User sent back to `/login`
4. **Session Ended**: All subsequent requests lack Authorization header
5. **Protected Routes Blocked**: AuthGuard prevents access

---

## Code Examples

### How to Use Authentication in a New Component

#### Example: Fetching User-Specific Data

```typescript
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-user-profile",
  standalone: true,
  template: `
    <div *ngIf="userData">
      <h2>Welcome, {{ userData.name }}!</h2>
      <p>Email: {{ userData.email }}</p>
    </div>
  `,
})
export class UserProfileComponent implements OnInit {
  userData: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // The AuthInterceptor automatically adds the token
    this.http.get("https://ecommerce.routemisr.com/api/v1/users/profile").subscribe({
      next: (data) => (this.userData = data),
      error: (err) => console.error("Failed to fetch profile", err),
    });
  }
}
```

---

### How to Implement Logout

#### In NavBlank Component:

```typescript
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-nav-blank",
  template: ` <button (click)="onLogout()">Logout</button> `,
})
export class NavBlankComponent {
  constructor(private authService: AuthService, private router: Router) {}

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
```

---

### How to Check Authentication Status

```typescript
import { Component, OnInit } from "@angular/core";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  template: `
    <div *ngIf="isLoggedIn">
      <p>You are logged in!</p>
    </div>
    <div *ngIf="!isLoggedIn">
      <p>Please log in.</p>
    </div>
  `,
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
  }
}
```

---

### How to Access Return URL After Login

```typescript
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  credentials = { email: "", password: "" };
  returnUrl: string = "/blank";

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Get the return URL from query params
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/blank";
  }

  onLoginSubmit(): void {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        // Navigate to the original intended URL
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        console.error("Login failed", err);
      },
    });
  }
}
```

---

## Routes Configuration

### Application Routes Structure

```typescript
export const routes: Routes = [
  {
    path: "",
    component: AuthLayoutComponent, // Layout for unauthenticated users
    children: [
      { path: "", redirectTo: "login", pathMatch: "full" },
      { path: "login", component: LoginComponent },
      { path: "register", component: RegisterComponent },
    ],
  },
  {
    path: "blank",
    component: BlankLayoutComponent, // Layout for authenticated users
    canActivate: [authGuard], // Protected with guard
    children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "home", component: HomeComponent },
      { path: "categories", component: CategoriesComponent },
      { path: "brands", component: BrandsComponent },
      { path: "cart", component: CartComponent },
    ],
  },
  { path: "**", component: NotfoundComponent }, // 404 page
];
```

### Route Patterns:

- **Public Routes**: `/login`, `/register`
- **Protected Routes**: `/blank/home`, `/blank/categories`, `/blank/brands`, `/blank/cart`
- **Default Route**: Redirects to `/login`
- **Fallback**: Any undefined route goes to NotFound component

---

## Application Configuration

### app.config.ts

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { AuthInterceptor } from "./interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([AuthInterceptor]) // Register interceptor
    ),
  ],
};
```

**Key Configurations**:

1. **Zone Change Detection**: Optimized with event coalescing
2. **Router**: Provides application routing
3. **HTTP Client**: Configured with interceptor for token injection
4. **Interceptor Registration**: Functional interceptor pattern

---

## Best Practices Implemented

### 1. ✅ Standalone Components

- Modern Angular approach
- No NgModule required
- Better tree-shaking and lazy loading

### 2. ✅ Functional Guards and Interceptors

- Cleaner, more testable code
- Follows Angular's latest patterns
- Uses dependency injection via `inject()`

### 3. ✅ Centralized Authentication Logic

- Single source of truth (AuthService)
- Reusable across components
- Easy to maintain and update

### 4. ✅ RxJS for Async Operations

- Observable-based API calls
- Reactive error handling
- Clean subscription management

### 5. ✅ Two-Way Data Binding with FormsModule

- Simplified form handling
- Real-time data synchronization
- Easy validation integration

### 6. ✅ Layout Components

- Separate layouts for auth and protected areas
- Consistent UI structure
- Easy to modify navigation and footers

### 7. ✅ Error Handling

- User-friendly error messages
- Graceful degradation
- Prevents app crashes

---

## Potential Enhancements

### 1. Token Expiration Handling

**Current**: Token is stored and used indefinitely
**Enhancement**:

```typescript
isAuthenticated(): boolean {
  const token = localStorage.getItem(this.TOKEN_KEY);
  if (token && !this.isTokenExpired(token)) {
    return true;
  }
  return false;
}

private isTokenExpired(token: string): boolean {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.exp * 1000 < Date.now();
}
```

---

### 2. Refresh Token Implementation

**Current**: Single token without refresh mechanism
**Enhancement**: Implement refresh token flow to extend sessions

---

### 3. Role-Based Access Control (RBAC)

**Current**: Simple authenticated/unauthenticated check
**Enhancement**: Add role-based guards for admin/user routes

```typescript
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.hasRole("admin")) {
    return true;
  }
  return router.createUrlTree(["/unauthorized"]);
};
```

---

### 4. Form Validation

**Current**: Basic HTML5 validation
**Enhancement**: Add Angular validators and error messages

```typescript
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

loginForm = this.fb.group({
  email: ["", [Validators.required, Validators.email]],
  password: ["", [Validators.required, Validators.minLength(6)]],
});
```

---

### 5. Loading States

**Current**: No loading indicators
**Enhancement**: Add loading spinners during API calls

```typescript
isLoading = false;

onLoginSubmit(): void {
  this.isLoading = true;
  this.authService.login(this.credentials).subscribe({
    next: (response) => {
      this.isLoading = false;
      this.router.navigate(['/blank']);
    },
    error: (err) => {
      this.isLoading = false;
      this.errorMessage = err.error.message;
    }
  });
}
```

---

### 6. Remember Me Functionality

**Current**: Remember me checkbox exists but not functional
**Enhancement**: Implement persistent vs session storage

---

### 7. Password Strength Indicator

**Enhancement**: Add visual feedback for password strength during registration

---

### 8. Social Authentication

**Enhancement**: Add OAuth providers (Google, Facebook, GitHub)

---

### 9. Two-Factor Authentication (2FA)

**Enhancement**: Add additional security layer with OTP/SMS verification

---

### 10. Security Headers

**Enhancement**: Implement Content Security Policy and other security headers

---

## Testing Recommendations

### Unit Testing

#### Test AuthService:

```typescript
describe("AuthService", () => {
  it("should store token on successful login", () => {
    // Test implementation
  });

  it("should return true for isAuthenticated when token exists", () => {
    // Test implementation
  });
});
```

#### Test AuthGuard:

```typescript
describe("AuthGuard", () => {
  it("should allow navigation when authenticated", () => {
    // Test implementation
  });

  it("should redirect to login when not authenticated", () => {
    // Test implementation
  });
});
```

---

### Integration Testing

- Test complete login flow
- Test token persistence across page reloads
- Test protected route access scenarios

---

### E2E Testing

- User registration journey
- User login journey
- Logout and re-login
- Protected route blocking

---

## Troubleshooting

### Common Issues

#### 1. NgModel Not Working

**Problem**: Values not updating in form fields
**Solution**: Ensure `name` attribute is present on input fields when using ngModel within `<form>` tags

```html
<input type="email" name="email" [(ngModel)]="credentials.email" />
```

---

#### 2. CORS Errors

**Problem**: Browser blocks API requests
**Solution**: Backend must include proper CORS headers (already handled by the API)

---

#### 3. Token Not Attached to Requests

**Problem**: 401 Unauthorized errors on protected endpoints
**Solution**: Verify interceptor is registered in `app.config.ts`

---

#### 4. Infinite Redirect Loop

**Problem**: Guard redirects cause loop
**Solution**: Ensure login route is not protected by guard

---

#### 5. Token Persists After Logout

**Problem**: User can still access protected routes after logout
**Solution**: Ensure `localStorage.removeItem()` is called properly

---

## Conclusion

This E-Commerce application implements a robust, modern authentication system following Angular best practices. The architecture is scalable, maintainable, and secure, providing a solid foundation for a production-ready application.

### Key Takeaways:

- ✅ JWT-based authentication with token storage
- ✅ HTTP interceptor for automatic token injection
- ✅ Route guards for access control
- ✅ Standalone components with functional approach
- ✅ Clean separation of concerns
- ✅ User-friendly error handling
- ✅ Reactive programming with RxJS

### Next Steps:

1. Implement token expiration validation
2. Add form validation with error messages
3. Implement logout functionality in navigation
4. Add loading states and user feedback
5. Consider implementing refresh tokens
6. Add comprehensive testing suite

---

**Document Version**: 1.0  
**Last Updated**: November 4, 2025  
**Author**: E-Commerce Development Team
