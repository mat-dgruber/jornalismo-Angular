import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { User } from '@angular/fire/auth';

describe('authGuard', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: { user$: any };

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authServiceSpy = { user$: of(null) };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
  });

  it('deve permitir a ativação da rota quando o usuário estiver autenticado', (done) => {
    const mockUser = { uid: '123', email: 'admin@mariaizabela.com.br' } as User;
    authServiceSpy.user$ = of(mockUser);

    TestBed.runInInjectionContext(() => {
      const result$ = authGuard(mockRoute, mockState) as any;
      result$.subscribe((canActivate: boolean) => {
        expect(canActivate).toBe(true);
        expect(routerSpy.navigate).not.toHaveBeenCalled();
        done();
      });
    });
  });

  it('deve bloquear a rota e redirecionar para /login quando não houver usuário autenticado', (done) => {
    authServiceSpy.user$ = of(null);

    TestBed.runInInjectionContext(() => {
      const result$ = authGuard(mockRoute, mockState) as any;
      result$.subscribe((canActivate: boolean) => {
        expect(canActivate).toBe(false);
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    });
  });
});
