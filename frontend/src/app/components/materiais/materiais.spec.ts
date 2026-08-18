import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Materiais } from './materiais';
import { MateriaisService, Material } from '../../services/materiais.service';
import { SeoService } from '../../services/seo.service';
import { environment } from '../../../environments/environment';

describe('MateriaisComponent', () => {
  let component: Materiais;
  let fixture: ComponentFixture<Materiais>;
  let materiaisServiceSpy: jasmine.SpyObj<MateriaisService>;
  let seoServiceSpy: jasmine.SpyObj<SeoService>;

  const mockMateriais: Material[] = [
    {
      id: 1,
      name: 'E-book de Jornalismo',
      description: 'Guia prático',
      image: '/media/materiais/ebook.webp',
      category: 'ebook',
      slug: 'ebook-jornalismo',
      type: 'gratuito',
      file: '/media/files/guia.pdf',
      published_date: '2026-01-01'
    }
  ];

  beforeEach(async () => {
    materiaisServiceSpy = jasmine.createSpyObj('MateriaisService', ['getMateriais', 'downloadFile']);
    seoServiceSpy = jasmine.createSpyObj('SeoService', ['updateSeo']);

    materiaisServiceSpy.getMateriais.and.returnValue(of(mockMateriais));
    materiaisServiceSpy.downloadFile.and.returnValue(of(new Blob(['pdf-data'], { type: 'application/pdf' })));

    await TestBed.configureTestingModule({
      imports: [Materiais],
      providers: [
        provideRouter([]),
        { provide: MateriaisService, useValue: materiaisServiceSpy },
        { provide: SeoService, useValue: seoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Materiais);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve atualizar o SEO com metadados de materiais', () => {
    expect(seoServiceSpy.updateSeo).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Materiais',
      url: '/materiais'
    }));
  });

  it('deve carregar a lista de materiais', () => {
    expect(component.materials.length).toBe(1);
    expect(component.isLoading).toBe(false);
  });

  it('deve desativar o estado de carregamento se houver erro ao buscar materiais', () => {
    materiaisServiceSpy.getMateriais.and.returnValue(throwError(() => new Error('Erro')));
    component.ngOnInit();
    expect(component.isLoading).toBe(false);
  });

  it('deve normalizar URLs de imagem corretamente no método getImageUrl', () => {
    expect(component.getImageUrl(undefined)).toBe('assets/Imagens/placeholder.jpg');
    expect(component.getImageUrl('')).toBe('assets/Imagens/placeholder.jpg');
    expect(component.getImageUrl('https://dominio.com/foto.jpg')).toBe('https://dominio.com/foto.jpg');

    const expectedBase = environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, -1) : environment.apiUrl;
    expect(component.getImageUrl('/media/foto.webp')).toBe(`${expectedBase}/media/foto.webp`);
    expect(component.getImageUrl('media/foto.webp')).toBe(`${expectedBase}/media/foto.webp`);
  });

  it('deve executar o download quando o material possuir arquivo vinculado', () => {
    spyOn(window, 'open');
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:mock-url');
    spyOn(window.URL, 'revokeObjectURL');

    component.onDownload(mockMateriais[0]);

    expect(window.open).toHaveBeenCalled();
    expect(materiaisServiceSpy.downloadFile).toHaveBeenCalled();
  });
});
