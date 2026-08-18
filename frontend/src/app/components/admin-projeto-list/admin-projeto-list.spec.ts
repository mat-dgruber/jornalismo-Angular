import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { AdminProjetoList } from './admin-projeto-list';
import { ProjetosService, Projeto } from '../../services/projetos.service';

describe('AdminProjetoListComponent', () => {
  let component: AdminProjetoList;
  let fixture: ComponentFixture<AdminProjetoList>;
  let projetosServiceSpy: jasmine.SpyObj<ProjetosService>;
  let confirmationService: ConfirmationService;

  const mockProjetos: Projeto[] = [
    { id: 1, titulo: 'Projeto Teste', descricao: 'Desc', data_realizacao: '2026-08-01', tipo: 'academico', slug: 'projeto-teste' }
  ];

  beforeEach(async () => {
    projetosServiceSpy = jasmine.createSpyObj('ProjetosService', ['getProjetos', 'deleteProjeto']);
    projetosServiceSpy.getProjetos.and.returnValue(of(mockProjetos));
    projetosServiceSpy.deleteProjeto.and.returnValue(of(undefined as void));

    await TestBed.configureTestingModule({
      imports: [AdminProjetoList],
      providers: [
        provideRouter([]),
        ConfirmationService,
        { provide: ProjetosService, useValue: projetosServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProjetoList);
    component = fixture.componentInstance;
    confirmationService = fixture.debugElement.injector.get(ConfirmationService);
    fixture.detectChanges();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve listar os projetos cadastrados', () => {
    expect(component.projetos.length).toBe(1);
    expect(projetosServiceSpy.getProjetos).toHaveBeenCalled();
  });

  it('deve excluir projeto após confirmação no modal', () => {
    spyOn(confirmationService, 'confirm').and.callFake((config: any) => {
      config.accept();
      return confirmationService;
    });

    component.deleteProjeto('projeto-teste');

    expect(confirmationService.confirm).toHaveBeenCalled();
    expect(projetosServiceSpy.deleteProjeto).toHaveBeenCalledWith('projeto-teste');
  });
});
