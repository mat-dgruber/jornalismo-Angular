import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ArtigoCreate } from './artigo-create';
import { ArtigosService, Artigo } from '../../services/artigos.service';

describe('ArtigoCreateComponent', () => {
  let component: ArtigoCreate;
  let fixture: ComponentFixture<ArtigoCreate>;
  let artigosServiceSpy: jasmine.SpyObj<ArtigosService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockArtigo: Artigo = {
    id: 1,
    titulo: 'Artigo Crítico de Jornalismo',
    subtitulo: 'Subtítulo do artigo',
    conteudo: 'Texto reflexivo',
    data_publicacao: '2026-08-01',
    local_publicacao: 'Revista de Comunicação',
    link_externo: 'https://revista.com/artigo',
    imagem: 'https://mariaizabela.com.br/artigo.webp'
  };

  beforeEach(async () => {
    artigosServiceSpy = jasmine.createSpyObj('ArtigosService', ['getArtigo', 'createArtigo', 'updateArtigo']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    artigosServiceSpy.getArtigo.and.returnValue(of(mockArtigo));
    artigosServiceSpy.createArtigo.and.returnValue(of(mockArtigo));
    artigosServiceSpy.updateArtigo.and.returnValue(of(mockArtigo));

    await TestBed.configureTestingModule({
      imports: [ArtigoCreate],
      providers: [
        provideRouter([]),
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => null
              }
            }
          }
        },
        { provide: ArtigosService, useValue: artigosServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ArtigoCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado em modo de criação', () => {
    expect(component).toBeTruthy();
    expect(component.isEditMode).toBe(false);
    expect(component.submitLabel).toBe('Publicar Artigo');
  });

  it('não deve salvar se o formulário for inválido', () => {
    component.artigoForm.controls['titulo'].setValue('');
    component.onSubmit();
    expect(artigosServiceSpy.createArtigo).not.toHaveBeenCalled();
  });

  it('deve enviar dados do artigo e navegar para tela de sucesso', () => {
    component.artigoForm.setValue({
      titulo: 'Título do Artigo com Mais de 5 Caracteres',
      subtitulo: 'Subtítulo',
      conteudo: 'Conteúdo relevante',
      data_publicacao: new Date('2026-08-01T00:00:00Z'),
      local_publicacao: 'Jornal Online',
      link_externo: '',
      image: null
    });

    component.onSubmit();

    expect(artigosServiceSpy.createArtigo).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/sucesso'], jasmine.objectContaining({
      queryParams: jasmine.objectContaining({
        message: 'Artigo publicado com sucesso!'
      })
    }));
  });

  it('deve redirecionar para tela de erro se houver falha na API', () => {
    artigosServiceSpy.createArtigo.and.returnValue(throwError(() => ({ error: { detail: 'Erro 500' } })));

    component.artigoForm.setValue({
      titulo: 'Título do Artigo com Mais de 5 Caracteres',
      subtitulo: 'Subtítulo',
      conteudo: 'Conteúdo relevante',
      data_publicacao: new Date('2026-08-01T00:00:00Z'),
      local_publicacao: 'Jornal Online',
      link_externo: '',
      image: null
    });

    component.onSubmit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/erro'], jasmine.objectContaining({
      queryParams: jasmine.objectContaining({
        message: 'Erro ao salvar o artigo.'
      })
    }));
  });
});
