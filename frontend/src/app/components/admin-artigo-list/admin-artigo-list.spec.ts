import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { AdminArtigoList } from './admin-artigo-list';
import { ArtigosService, Artigo } from '../../services/artigos.service';

describe('AdminArtigoListComponent', () => {
  let component: AdminArtigoList;
  let fixture: ComponentFixture<AdminArtigoList>;
  let artigosServiceSpy: jasmine.SpyObj<ArtigosService>;
  let confirmationService: ConfirmationService;

  const mockArtigos: Artigo[] = [
    { id: 1, titulo: 'Artigo Teste', conteudo: 'Texto', data_publicacao: '2026-08-01', local_publicacao: 'Jornal' }
  ];

  beforeEach(async () => {
    artigosServiceSpy = jasmine.createSpyObj('ArtigosService', ['getArtigos', 'deleteArtigo']);
    artigosServiceSpy.getArtigos.and.returnValue(of(mockArtigos));
    artigosServiceSpy.deleteArtigo.and.returnValue(of(undefined as void));

    await TestBed.configureTestingModule({
      imports: [AdminArtigoList],
      providers: [
        provideRouter([]),
        ConfirmationService,
        { provide: ArtigosService, useValue: artigosServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminArtigoList);
    component = fixture.componentInstance;
    confirmationService = fixture.debugElement.injector.get(ConfirmationService);
    fixture.detectChanges();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve listar os artigos cadastrados', () => {
    expect(component.artigos.length).toBe(1);
    expect(artigosServiceSpy.getArtigos).toHaveBeenCalled();
  });

  it('deve excluir artigo após confirmação do usuário', () => {
    spyOn(confirmationService, 'confirm').and.callFake((config: any) => {
      config.accept();
      return confirmationService;
    });

    component.deleteArtigo('artigo-teste');

    expect(confirmationService.confirm).toHaveBeenCalled();
    expect(artigosServiceSpy.deleteArtigo).toHaveBeenCalledWith('artigo-teste');
  });
});
