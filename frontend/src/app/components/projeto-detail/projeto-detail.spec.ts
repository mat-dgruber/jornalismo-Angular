import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProjetoDetail } from './projeto-detail';
import { ProjetosService, Projeto } from '../../services/projetos.service';
import { SeoService } from '../../services/seo.service';

describe('ProjetoDetailComponent', () => {
  let component: ProjetoDetail;
  let fixture: ComponentFixture<ProjetoDetail>;
  let projetosServiceSpy: jasmine.SpyObj<ProjetosService>;
  let seoServiceSpy: jasmine.SpyObj<SeoService>;

  const mockProjeto: Projeto = {
    id: 1,
    titulo: 'Portal de Jornalismo Comunitário',
    descricao: 'Projeto de extensão universitária',
    data_realizacao: '2026-06-01',
    tipo: 'academico',
    slug: 'portal-jornalismo-comunitario',
    imagem: 'https://mariaizabela.com.br/proj.webp'
  };

  beforeEach(async () => {
    projetosServiceSpy = jasmine.createSpyObj('ProjetosService', ['getProjeto']);
    seoServiceSpy = jasmine.createSpyObj('SeoService', ['updateSeo']);

    projetosServiceSpy.getProjeto.and.returnValue(of(mockProjeto));

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => key === 'slug' ? 'portal-jornalismo-comunitario' : null
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ProjetoDetail],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: ProjetosService, useValue: projetosServiceSpy },
        { provide: SeoService, useValue: seoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjetoDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar o projeto através do slug da rota', () => {
    expect(projetosServiceSpy.getProjeto).toHaveBeenCalledWith('portal-jornalismo-comunitario');
  });

  it('deve atualizar o SEO com os dados do projeto retornado', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    TestBed.flushEffects();

    expect(seoServiceSpy.updateSeo).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Portal de Jornalismo Comunitário',
      description: 'Projeto de extensão universitária',
      url: '/projetos/portal-jornalismo-comunitario'
    }));
  });
});
