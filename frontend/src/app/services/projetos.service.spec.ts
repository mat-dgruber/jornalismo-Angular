import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProjetosService, Projeto } from './projetos.service';
import { environment } from '../../environments/environment';

describe('ProjetosService', () => {
  let service: ProjetosService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/projetos/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProjetosService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ProjetosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(service).toBeTruthy();
  });

  it('deve listar projetos via GET', () => {
    const mockProjetos: Projeto[] = [
      {
        id: 1,
        titulo: 'TCC - Comunicação e Religião',
        descricao: 'Pesquisa acadêmica',
        data_realizacao: '2026',
        tipo: 'academico',
        slug: 'tcc-comunicacao-e-religiao'
      }
    ];

    service.getProjetos().subscribe(projetos => {
      expect(projetos.length).toBe(1);
      expect(projetos[0].tipo).toBe('academico');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockProjetos);
  });

  it('deve buscar projeto por slug via GET', () => {
    const mockProjeto: Projeto = {
      id: 1,
      titulo: 'Cobertura Especial',
      descricao: 'Projeto pessoal',
      data_realizacao: '2025',
      tipo: 'pessoal',
      slug: 'cobertura-especial'
    };

    service.getProjeto('cobertura-especial').subscribe(proj => {
      expect(proj.titulo).toBe('Cobertura Especial');
    });

    const req = httpMock.expectOne(`${baseUrl}cobertura-especial/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProjeto);
  });

  it('deve criar projeto via POST', () => {
    const formData = new FormData();
    const mockResponse: Projeto = {
      id: 2,
      titulo: 'Novo Projeto',
      descricao: 'Desc',
      data_realizacao: '2026',
      tipo: 'academico'
    };

    service.createProjeto(formData).subscribe(proj => {
      expect(proj.id).toBe(2);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('deve atualizar projeto via PUT', () => {
    const formData = new FormData();
    const mockResponse: Projeto = {
      id: 1,
      titulo: 'Projeto Editado',
      descricao: 'Desc',
      data_realizacao: '2026',
      tipo: 'academico',
      slug: 'projeto-editado'
    };

    service.updateProjeto('projeto-editado', formData).subscribe(proj => {
      expect(proj.titulo).toBe('Projeto Editado');
    });

    const req = httpMock.expectOne(`${baseUrl}projeto-editado/`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('deve deletar projeto via DELETE', () => {
    service.deleteProjeto('proj-del').subscribe(() => {});

    const req = httpMock.expectOne(`${baseUrl}proj-del/`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
