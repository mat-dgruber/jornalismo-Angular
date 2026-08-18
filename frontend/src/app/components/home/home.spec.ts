import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Home } from './home';
import { BlogService } from '../../services/blog.service';
import { MateriaisService } from '../../services/materiais.service';
import { ArtigosService } from '../../services/artigos.service';
import { ProjetosService } from '../../services/projetos.service';
import { SeoService } from '../../services/seo.service';

describe('HomeComponent', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let seoServiceSpy: jasmine.SpyObj<SeoService>;

  const mockPosts = [
    { id: 1, title: 'Post 1', slug: 'post-1', subtitle: 'Sub 1', content: 'Cont 1' }
  ];
  const mockMateriais = [
    { id: 1, name: 'Mat 1', description: 'Desc 1', category: 'cat', slug: 'mat-1', image: '', type: 'gratuito' as const, published_date: '2026' }
  ];
  const mockArtigos = [
    { id: 1, titulo: 'Art 1', conteudo: 'Cont 1', data_publicacao: '2026', local_publicacao: 'Local' }
  ];
  const mockProjetos = [
    { id: 1, titulo: 'Proj 1', descricao: 'Desc 1', data_realizacao: '2026', tipo: 'academico' as const, slug: 'proj-1' }
  ];

  beforeEach(async () => {
    seoServiceSpy = jasmine.createSpyObj('SeoService', ['updateSeo']);

    const blogServiceMock = { getPosts: () => of(mockPosts) };
    const materiaisServiceMock = { getMateriais: () => of(mockMateriais) };
    const artigosServiceMock = { getArtigos: () => of(mockArtigos) };
    const projetosServiceMock = { getProjetos: () => of(mockProjetos) };

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { fragment: null } } },
        { provide: BlogService, useValue: blogServiceMock },
        { provide: MateriaisService, useValue: materiaisServiceMock },
        { provide: ArtigosService, useValue: artigosServiceMock },
        { provide: ProjetosService, useValue: projetosServiceMock },
        { provide: SeoService, useValue: seoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar SeoService.updateSeo na inicialização', () => {
    expect(seoServiceSpy.updateSeo).toHaveBeenCalled();
  });

  it('deve carregar dados recentes de posts, artigos, projetos e materiais', () => {
    expect(component.recentPosts.length).toBe(1);
    expect(component.recentArticles.length).toBe(1);
    expect(component.recentProjects.length).toBe(1);
    expect(component.recentMaterials.length).toBe(1);

    expect(component.isLoadingPosts).toBe(false);
    expect(component.isLoadingArticles).toBe(false);
    expect(component.isLoadingProjects).toBe(false);
    expect(component.isLoadingMaterials).toBe(false);
  });

  it('deve abrir o modal de certificações Lattes ao chamar showCertifications()', () => {
    expect(component.isCertificationsModalVisible).toBe(false);
    component.showCertifications();
    expect(component.isCertificationsModalVisible).toBe(true);
  });
});
