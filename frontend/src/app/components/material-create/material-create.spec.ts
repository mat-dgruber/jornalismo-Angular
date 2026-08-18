import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MaterialCreate } from './material-create';
import { MateriaisService, Material } from '../../services/materiais.service';

describe('MaterialCreateComponent', () => {
  let component: MaterialCreate;
  let fixture: ComponentFixture<MaterialCreate>;
  let materiaisServiceSpy: jasmine.SpyObj<MateriaisService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockMaterial: Material = {
    id: 1,
    name: 'Guia Prático de Reportagem',
    description: 'E-book completo',
    category: 'ebook',
    slug: 'guia-pratico-reportagem',
    image: 'https://mariaizabela.com.br/capa.webp',
    type: 'gratuito',
    published_date: '2026-08-01'
  };

  beforeEach(async () => {
    materiaisServiceSpy = jasmine.createSpyObj('MateriaisService', ['getMaterial', 'createMaterial', 'updateMaterial']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    materiaisServiceSpy.getMaterial.and.returnValue(of(mockMaterial));
    materiaisServiceSpy.createMaterial.and.returnValue(of(mockMaterial));
    materiaisServiceSpy.updateMaterial.and.returnValue(of(mockMaterial));

    await TestBed.configureTestingModule({
      imports: [MaterialCreate],
      providers: [
        provideRouter([]),
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({}))
          }
        },
        { provide: MateriaisService, useValue: materiaisServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado em modo de criação', () => {
    expect(component).toBeTruthy();
    expect(component.isEditMode).toBe(false);
  });

  it('não deve enviar requisição se o formulário for inválido', () => {
    component.onSubmit();
    expect(materiaisServiceSpy.createMaterial).not.toHaveBeenCalled();
  });

  it('deve submeter e criar material gratuito com sucesso', () => {
    const dummyImage = new File(['img'], 'capa.webp', { type: 'image/webp' });
    const dummyFile = new File(['pdf'], 'livro.pdf', { type: 'application/pdf' });

    component.selectedImage = dummyImage;
    component.selectedFile = dummyFile;

    component.materialForm.setValue({
      name: 'Guia de Comunicação Comunitária',
      description: 'Material didático',
      category: 'ebook',
      type: 'gratuito',
      price: null,
      external_link: '',
      image: dummyImage,
      file: dummyFile
    });

    component.onSubmit();

    expect(materiaisServiceSpy.createMaterial).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/sucesso'], jasmine.objectContaining({
      queryParams: jasmine.objectContaining({
        message: 'Material criado com sucesso!'
      })
    }));
  });

  it('deve incluir preço e link externo para materiais do tipo pago', () => {
    const dummyImage = new File(['img'], 'capa.webp', { type: 'image/webp' });
    component.selectedImage = dummyImage;

    component.materialForm.setValue({
      name: 'Curso de Jornalismo Investigativo',
      description: 'Treinamento completo',
      category: 'curso',
      type: 'pago',
      price: 49.9,
      external_link: 'https://hotmart.com/curso',
      image: dummyImage,
      file: null
    });

    component.onSubmit();

    expect(materiaisServiceSpy.createMaterial).toHaveBeenCalled();
  });

  it('deve navegar para a tela de erro quando houver falha de rede', () => {
    materiaisServiceSpy.createMaterial.and.returnValue(throwError(() => ({ status: 0, message: 'Network error' })));

    const dummyImage = new File(['img'], 'capa.webp', { type: 'image/webp' });
    component.selectedImage = dummyImage;

    component.materialForm.setValue({
      name: 'Guia Rápido',
      description: 'Descrição',
      category: 'ebook',
      type: 'gratuito',
      price: null,
      external_link: '',
      image: dummyImage,
      file: null
    });

    component.onSubmit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/erro'], jasmine.objectContaining({
      queryParams: jasmine.objectContaining({
        message: 'Erro ao salvar o material.'
      })
    }));
  });
});
