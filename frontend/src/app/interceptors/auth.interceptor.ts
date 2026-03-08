import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth, idToken, authState } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { catchError, switchMap, take, filter, timeout, first } from 'rxjs/operators';
import { throwError, of, timer } from 'rxjs';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const router = inject(Router);

  // We want to wait for Firebase Auth to initialize. 
  // authState(auth) will emit the user or null once initialized.
  return authState(auth).pipe(
    // Give it a moment to initialize if it's null initially
    // but don't block forever if no one is logged in.
    take(1),
    switchMap((u) => {
      if (!u) {
        // console.log('AuthInterceptor: No user found, proceeding without token for:', req.url);
        return next(req);
      }

      // User is logged in, get the token. 
      // idToken(auth) will emit the latest token.
      return idToken(auth).pipe(
        filter(token => token !== null),
        take(1),
        timeout({
            each: 5000,
            with: () => {
                console.warn('AuthInterceptor: Timeout waiting for Firebase token');
                return of(null);
            }
        }),
        switchMap((token) => {
          let authReq = req;
          
          // Only attach token if the request is for our API
          if (token && req.url.startsWith(environment.apiUrl)) {
            // console.log('AuthInterceptor: Attaching token to request:', req.url);
            authReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
              },
            });
          }

          return next(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
              if (error.status === 401 || error.status === 403) {
                console.error(
                  `AuthInterceptor: Session expired or access denied (${error.status}). Redirecting to login...`,
                  error.message
                );
                router.navigate(['/login']);
              }
              return throwError(() => error);
            }),
          );
        })
      );
    })
  );
};
