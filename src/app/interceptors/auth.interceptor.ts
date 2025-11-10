import { HttpInterceptorFn } from '@angular/common/http';

const TOKEN_KEY = 'authToken';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem(TOKEN_KEY);

  // If a token exists, clone the request and add the Authorization header
  if (authToken) {
    console.log(
      'Token found in localStorage:',
      authToken.substring(0, 20) + '...'
    );
    const cloned = req.clone({
      headers: req.headers.set('token', authToken),
    });
    console.log('Request headers:', cloned.headers.get('token'));
    return next(cloned);
  } else {
    console.log('No token found in localStorage');
  }

  // Otherwise, continue with the original request
  return next(req);
};
