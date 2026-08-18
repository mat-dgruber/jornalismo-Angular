// MARK: - Imports & Dependencies
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth, idToken, authState } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { catchError, switchMap, take, filter, timeout } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { environment } from '../../environments/environment';

// MARK: - Interceptor Implementation
/**
 * Interceptor HTTP funcional responsável por anexar tokens Bearer JWT nas requisições destinadas à API do backend
 * e interceptar respostas não autorizadas (401/403) para redirecionamento ao fluxo de login.
 *
 * @param req Requisição HTTP original sendo despachada.
 * @param next Próximo manipulador da cadeia de interceptors HTTP.
 * @returns Observable da resposta HTTP processada com cabeçalho de autenticação (se aplicável).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // MARK: - Injected Dependencies
  const auth = inject(Auth);
  const router = inject(Router);

  // MARK: - Token Resolution & Request Mutation
  // Aguarda a inicialização do Firebase Auth para obter o estado do usuário corrente.
  return authState(auth).pipe(
    take(1),
    switchMap((u) => {
      // Caso não haja usuário autenticado, prossegue com a requisição anônima original
      if (!u) {
        return next(req);
      }

      // Obtém o token JWT atualizado do usuário autenticado com limite de timeout
      return idToken(auth).pipe(
        filter((token): token is string => token !== null),
        take(1),
        timeout({
          each: 5000,
          with: () => {
            console.warn('AuthInterceptor: Timeout ao aguardar token do Firebase Auth.');
            return of(null);
          }
        }),
        switchMap((token) => {
          let authReq = req;

          // Aplicação de Zero-Trust: Anexa o Bearer token apenas para requisições destinadas à nossa própria API
          if (token && req.url.startsWith(environment.apiUrl)) {
            authReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
          }

          // MARK: - Response & Error Handling
          return next(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
              // Em caso de expiração da sessão ou acesso negado, redireciona ao login
              if (error.status === 401 || error.status === 403) {
                console.error(
                  `AuthInterceptor: Sessão expirada ou acesso negado (${error.status}). Redirecionando para login...`,
                  error.message
                );
                router.navigate(['/login']);
              }
              return throwError(() => error);
            })
          );
        })
      );
    })
  );
};
