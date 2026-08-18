import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['loginWithGoogle', 'loginWithEmail']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar com o formulário inválido', () => {
    expect(component.loginForm.valid).toBe(false);
  });

  it('deve efetuar login com Google e redirecionar para /admin em caso de sucesso', async () => {
    authServiceSpy.loginWithGoogle.and.resolveTo({} as any);

    await component.loginGoogle();

    expect(authServiceSpy.loginWithGoogle).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('não deve efetuar login por email se o formulário for inválido', async () => {
    await component.loginEmail();

    expect(authServiceSpy.loginWithEmail).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('deve autenticar por email/senha e redirecionar para /admin quando o formulário for válido', async () => {
    authServiceSpy.loginWithEmail.and.resolveTo({} as any);

    component.loginForm.setValue({
      email: 'admin@mariaizabela.com.br',
      password: 'senhaSegura123'
    });

    await component.loginEmail();

    expect(authServiceSpy.loginWithEmail).toHaveBeenCalledWith('admin@mariaizabela.com.br', 'senhaSegura123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('deve capturar erro e exibir alerta se a autenticação falhar', async () => {
    authServiceSpy.loginWithEmail.and.rejectWith(new Error('Auth failed'));
    spyOn(window, 'alert');

    component.loginForm.setValue({
      email: 'admin@mariaizabela.com.br',
      password: 'senhaIncorreta'
    });

    await component.loginEmail();

    expect(authServiceSpy.loginWithEmail).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Erro ao fazer login. Verifique suas credenciais.');
  });
});
