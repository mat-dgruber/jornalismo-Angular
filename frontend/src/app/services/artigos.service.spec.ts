import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ArtigosService, Artigo } from './artigos.service';
import { environment } from '../../environments/environment';

describe('ArtigosService', () => {
  let service: ArtigosService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/artigos/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ArtigosService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ArtigosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(service).toBeTruthy();
  });

  it('deve listar artigos via GET', () => {
    const mockArtigos: Artigo[] = [
      {
        id: 1,
        titulo: 'Reportagem Folha',
        conteudo: 'Texto da matéria',
        data_publicacao: '2026-08-10',
        local_publicacao: 'Portal de Notícias',
        slug: 'reportagem-folha'
      }
    ];

    service.getArtigos().subscribe(artigos => {
      expect(artigos.length).toBe(1);
      expect(artigos[0].titulo).toBe('Reportagem Folha');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockArtigos);
  });

  it('deve buscar artigo específico por slug via GET', () => {
    const mockArtigo: Artigo = {
      id: 1,
      titulo: 'Entrevista Exclusiva',
      conteudo: 'Transcrição da entrevista',
      data_publicacao: '2026-08-12',
      local_publicacao: 'Revista Cultural',
      slug: 'entrevista-exclusiva'
    };

    service.getArtigo('entrevista-exclusiva').subscribe(artigo => {
      expect(artigo.titulo).toBe('Entrevista Exclusiva');
      expect(artigo.local_publicacao).toBe('Revista Cultural');
    });

    const req = httpMock.expectOne(`${baseUrl}entrevista-exclusiva/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockArtigo);
  });

  it('deve criar um artigo via POST', () => {
    const formData = new FormData();
    formData.append('titulo', 'Novo Artigo');

    const mockResponse: Artigo = {
      id: 2,
      titulo: 'Novo Artigo',
      conteudo: 'Texto',
      data_publicacao: '2026-08-15',
      local_publicacao: 'Jornal Local',
      slug: 'novo-artigo'
    };

    service.createArtigo(formData).subscribe(artigo => {
      expect(artigo.id).toBe(2);
      expect(artigo.titulo).toBe('Novo Artigo');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('deve atualizar um artigo via PUT', () => {
    const formData = new FormData();
    const mockResponse: Artigo = {
      id: 1,
      titulo: 'Artigo Atualizado',
      conteudo: 'Texto modificado',
      data_publicacao: '2026-08-15',
      local_publicacao: 'Jornal Local',
      slug: 'artigo-atualizado'
    };

    service.updateArtigo('artigo-atualizado', formData).subscribe(artigo => {
      expect(artigo.titulo).toBe('Artigo Atualizado');
    });

    const req = httpMock.expectOne(`${baseUrl}artigo-atualizado/`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('deve deletar um artigo via DELETE', () => {
    service.deleteArtigo('artigo-delete').subscribe(() => {});

    const req = httpMock.expectOne(`${baseUrl}artigo-delete/`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
