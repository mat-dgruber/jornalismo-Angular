import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MateriaisService, Material } from './materiais.service';
import { environment } from '../../environments/environment';

describe('MateriaisService', () => {
  let service: MateriaisService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/materiais/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MateriaisService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(MateriaisService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(service).toBeTruthy();
  });

  it('deve listar materiais educativos via GET', () => {
    const mockMateriais: Material[] = [
      {
        id: 1,
        name: 'E-book: Redação Editorial',
        description: 'Guia completo',
        image: 'img.webp',
        category: 'e-book',
        slug: 'ebook-redacao-editorial',
        type: 'gratuito',
        published_date: '2026-08-01'
      }
    ];

    service.getMateriais().subscribe(materiais => {
      expect(materiais.length).toBe(1);
      expect(materiais[0].name).toBe('E-book: Redação Editorial');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockMateriais);
  });

  it('deve buscar material por slug via GET', () => {
    const mockMaterial: Material = {
      id: 1,
      name: 'Cartilha de Mídia',
      description: 'Guia',
      image: 'img.webp',
      category: 'cartilha',
      slug: 'cartilha-de-midia',
      type: 'gratuito',
      published_date: '2026-08-01'
    };

    service.getMaterial('cartilha-de-midia').subscribe(mat => {
      expect(mat.name).toBe('Cartilha de Mídia');
    });

    const req = httpMock.expectOne(`${baseUrl}cartilha-de-midia/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMaterial);
  });

  it('deve atualizar material via PATCH com FormData', () => {
    const formData = new FormData();
    const mockResponse: Material = {
      id: 1,
      name: 'Material Atualizado',
      description: 'Nova desc',
      image: 'img.webp',
      category: 'e-book',
      slug: 'material-atualizado',
      type: 'pago',
      price: 29.9,
      published_date: '2026-08-01'
    };

    service.updateMaterial('material-atualizado', formData).subscribe(mat => {
      expect(mat.name).toBe('Material Atualizado');
      expect(mat.price).toBe(29.9);
    });

    const req = httpMock.expectOne(`${baseUrl}material-atualizado/`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockResponse);
  });

  it('deve deletar material via DELETE', () => {
    service.deleteMaterial('mat-del').subscribe(() => {});

    const req = httpMock.expectOne(`${baseUrl}mat-del/`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('deve baixar arquivo binário via GET com responseType blob', () => {
    const mockBlob = new Blob(['conteudo do arquivo'], { type: 'application/pdf' });

    service.downloadFile('https://example.com/file.pdf').subscribe(blob => {
      expect(blob).toBeTruthy();
      expect(blob.type).toBe('application/pdf');
    });

    const req = httpMock.expectOne('https://example.com/file.pdf');
    expect(req.request.responseType).toBe('blob');
    req.flush(mockBlob);
  });
});
