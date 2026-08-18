import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FeedbackError } from './feedback-error';

describe('FeedbackErrorComponent', () => {
  let component: FeedbackError;
  let fixture: ComponentFixture<FeedbackError>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

    await TestBed.configureTestingModule({
      imports: [FeedbackError],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              message: 'Falha ao salvar o artigo.',
              details: 'Erro de validação do banco de dados.',
              retryUrl: '/admin/artigos/novo',
              backUrl: '/admin'
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackError);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve ler os parâmetros de erro a partir da rota', () => {
    expect(component.message).toBe('Falha ao salvar o artigo.');
    expect(component.details).toBe('Erro de validação do banco de dados.');
    expect(component.retryUrl).toBe('/admin/artigos/novo');
    expect(component.backUrl).toBe('/admin');
  });

  it('deve redirecionar para backUrl ao acionar goBack()', () => {
    component.goBack();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/admin');
  });

  it('deve redirecionar para retryUrl ao acionar retry()', () => {
    component.retry();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/admin/artigos/novo');
  });

  it('deve redirecionar para /admin ao acionar retry() quando retryUrl estiver vazio', () => {
    component.retryUrl = '';
    component.retry();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin']);
  });
});
