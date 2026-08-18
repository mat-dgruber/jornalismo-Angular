import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Artigos } from './artigos';
import { ArtigosService } from '../../services/artigos.service';
import { SeoService } from '../../services/seo.service';

describe('ArtigosComponent', () => {
  let component: Artigos;
  let fixture: ComponentFixture<Artigos>;
  let seoServiceSpy: jasmine.SpyObj<SeoService>;

  const mockArtigos = [
    { id: 1, titulo: 'Artigo Antigo', conteudo: 'Conteúdo 1', data_publicacao: '2026-01-01', local_publicacao: 'Jornal A' },
    { id: 2, titulo: 'Artigo Novo', conteudo: 'Conteúdo 2', data_publicacao: '2026-02-01', local_publicacao: 'Revista B' }
  ];

  beforeEach(async () => {
    seoServiceSpy = jasmine.createSpyObj('SeoService', ['updateSeo']);
    const artigosServiceMock = {
      getArtigos: () => of([...mockArtigos])
    };

    await TestBed.configureTestingModule({
      imports: [Artigos],
      providers: [
        provideRouter([]),
        { provide: ArtigosService, useValue: artigosServiceMock },
        { provide: SeoService, useValue: seoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Artigos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve atualizar o SEO com os metadados da página de artigos', () => {
    expect(seoServiceSpy.updateSeo).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Artigos | Maria Izabela',
      url: '/artigos'
    }));
  });

  it('deve carregar os artigos ordenados do mais recente para o mais antigo', () => {
    expect(component.articles.length).toBe(2);
    expect(component.articles[0].id).toBe(2);
    expect(component.articles[1].id).toBe(1);
  });
});
