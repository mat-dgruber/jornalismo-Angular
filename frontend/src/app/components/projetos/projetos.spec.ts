import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Projetos } from './projetos';
import { ProjetosService, Projeto } from '../../services/projetos.service';
import { SeoService } from '../../services/seo.service';

describe('ProjetosComponent', () => {
  let component: Projetos;
  let fixture: ComponentFixture<Projetos>;
  let seoServiceSpy: jasmine.SpyObj<SeoService>;

  const mockProjetos: Projeto[] = [
    { id: 1, titulo: 'Projeto 1', descricao: 'Desc 1', data_realizacao: '2026-01-01', tipo: 'academico', slug: 'projeto-1' },
    { id: 2, titulo: 'Projeto 2', descricao: 'Desc 2', data_realizacao: '2026-02-01', tipo: 'pessoal', slug: 'projeto-2' }
  ];

  beforeEach(async () => {
    seoServiceSpy = jasmine.createSpyObj('SeoService', ['updateSeo']);

    await TestBed.configureTestingModule({
      imports: [Projetos],
      providers: [
        provideRouter([]),
        {
          provide: ProjetosService,
          useValue: {
            getProjetos: () => of([...mockProjetos])
          }
        },
        { provide: SeoService, useValue: seoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Projetos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve atualizar o SEO com os metadados da página de projetos', () => {
    expect(seoServiceSpy.updateSeo).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Projetos',
      url: '/projetos'
    }));
  });

  it('deve carregar os projetos e desativar o estado de carregamento', () => {
    expect(component.projects.length).toBe(2);
    expect(component.projects[0].id).toBe(2); // Invertido pelo reverse()
    expect(component.isLoading).toBe(false);
  });

  it('deve desativar o estado de carregamento mesmo se a API retornar erro', () => {
    const projetosService = TestBed.inject(ProjetosService);
    spyOn(projetosService, 'getProjetos').and.returnValue(throwError(() => new Error('Erro de rede')));

    component.ngOnInit();
    expect(component.isLoading).toBe(false);
  });
});
