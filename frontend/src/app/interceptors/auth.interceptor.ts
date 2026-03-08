import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth, idToken } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { catchError, switchMap, take } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const router = inject(Router);

  // Use idToken observable to ensure we wait for the auth state to initialize
  return idToken(auth).pipe(
    take(1),
    switchMap((token) => {
      let authReq = req;
      if (token) {
        authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          // If we get a 401 or 403, it means our session is invalid or we lack permissions
          if (error.status === 401 || error.status === 403) {
            console.error(
              'Sessão expirada ou acesso negado. Redirecionando para login...',
            );
            // Optional: You could also call auth.signOut() here
            router.navigate(['/login']);
          }
          return throwError(() => error);
        }),
      );
    }),
  );
};
