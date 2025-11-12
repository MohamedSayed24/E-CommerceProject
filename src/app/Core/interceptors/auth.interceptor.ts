import { HttpInterceptorFn } from '@angular/common/http';

const TOKEN_KEY = 'authToken';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem(TOKEN_KEY);

  // If a token exists, clone the request and add the Authorization header
  if (authToken) {
  
    const cloned = req.clone({
      headers: req.headers.set('token', authToken),
    });
   
    return next(cloned);
  } else {
    console.log('No token found in localStorage');
  }

  // Otherwise, continue with the original request
  return next(req);
};
