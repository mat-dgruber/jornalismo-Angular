import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { MaterialList } from './material-list';
import { MateriaisService, Material } from '../../services/materiais.service';

describe('MaterialListComponent', () => {
  let component: MaterialList;
  let fixture: ComponentFixture<MaterialList>;
  let materiaisServiceSpy: jasmine.SpyObj<MateriaisService>;
  let confirmationService: ConfirmationService;

  const mockMateriais: Material[] = [
    { id: 1, name: 'Guia Editorial', description: 'Desc', image: '', category: 'ebook', slug: 'guia-editorial', type: 'gratuito', published_date: '2026-08-01' }
  ];

  beforeEach(async () => {
    materiaisServiceSpy = jasmine.createSpyObj('MateriaisService', ['getMateriais', 'deleteMaterial']);
    materiaisServiceSpy.getMateriais.and.returnValue(of(mockMateriais));
    materiaisServiceSpy.deleteMaterial.and.returnValue(of(undefined as void));

    await TestBed.configureTestingModule({
      imports: [MaterialList],
      providers: [
        provideRouter([]),
        ConfirmationService,
        { provide: MateriaisService, useValue: materiaisServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialList);
    component = fixture.componentInstance;
    confirmationService = fixture.debugElement.injector.get(ConfirmationService);
    fixture.detectChanges();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve listar os materiais cadastrados', () => {
    expect(component.materiais.length).toBe(1);
    expect(materiaisServiceSpy.getMateriais).toHaveBeenCalled();
  });

  it('deve excluir o material após confirmação', () => {
    spyOn(confirmationService, 'confirm').and.callFake((config: any) => {
      config.accept();
      return confirmationService;
    });

    component.deleteMaterial('guia-editorial');

    expect(confirmationService.confirm).toHaveBeenCalled();
    expect(materiaisServiceSpy.deleteMaterial).toHaveBeenCalledWith('guia-editorial');
  });
});
