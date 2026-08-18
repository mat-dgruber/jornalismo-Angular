import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FeedbackSuccess } from './feedback-success';

describe('FeedbackSuccessComponent', () => {
  let component: FeedbackSuccess;
  let fixture: ComponentFixture<FeedbackSuccess>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [FeedbackSuccess],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              message: 'Artigo publicado com sucesso!',
              actionLabel: 'Ver artigos',
              actionUrl: '/artigos',
              createLabel: 'Novo Artigo',
              createUrl: '/admin/artigos/novo'
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackSuccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve extrair as mensagens e rotas personalizadas a partir dos queryParams', () => {
    expect(component.message).toBe('Artigo publicado com sucesso!');
    expect(component.actionLabel).toBe('Ver artigos');
    expect(component.actionUrl).toBe('/artigos');
    expect(component.createLabel).toBe('Novo Artigo');
    expect(component.createUrl).toBe('/admin/artigos/novo');
  });

  it('deve navegar para actionUrl ao chamar goBack()', () => {
    component.goBack();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/artigos');
  });

  it('deve navegar para createUrl ao chamar createNew()', () => {
    component.createNew();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/admin/artigos/novo');
  });
});
