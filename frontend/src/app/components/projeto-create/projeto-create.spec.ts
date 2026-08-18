import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProjetoCreate } from './projeto-create';
import { ProjetosService, Projeto } from '../../services/projetos.service';

describe('ProjetoCreateComponent', () => {
  let component: ProjetoCreate;
  let fixture: ComponentFixture<ProjetoCreate>;
  let projetosServiceSpy: jasmine.SpyObj<ProjetosService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockProjeto: Projeto = {
    id: 1,
    titulo: 'Grande Projeto Editorial',
    subtitulo: 'Subtítulo',
    descricao: 'Descrição do projeto',
    conteudo: 'Conteúdo detalhado',
    data_realizacao: '2026-08-01',
    tipo: 'academico',
    slug: 'grande-projeto-editorial'
  };

  beforeEach(async () => {
    projetosServiceSpy = jasmine.createSpyObj('ProjetosService', ['getProjeto', 'createProjeto', 'updateProjeto']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    projetosServiceSpy.getProjeto.and.returnValue(of(mockProjeto));
    projetosServiceSpy.createProjeto.and.returnValue(of(mockProjeto));
    projetosServiceSpy.updateProjeto.and.returnValue(of(mockProjeto));

    await TestBed.configureTestingModule({
      imports: [ProjetoCreate],
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
        { provide: ProjetosService, useValue: projetosServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjetoCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado em modo de criação', () => {
    expect(component).toBeTruthy();
    expect(component.isEditMode).toBe(false);
    expect(component.submitLabel).toBe('Publicar Projeto');
  });

  it('não deve enviar requisição se o formulário for inválido', () => {
    component.projetoForm.controls['titulo'].setValue('');
    component.onSubmit();
    expect(projetosServiceSpy.createProjeto).not.toHaveBeenCalled();
  });

  it('deve criar um projeto com sucesso quando os campos forem preenchidos', () => {
    component.projetoForm.setValue({
      titulo: 'Projeto Acadêmico Teste',
      subtitulo: 'Subtítulo',
      descricao: 'Descrição detalhada do projeto',
      conteudo: 'Conteúdo rico',
      data_realizacao: new Date('2026-08-01T00:00:00Z'),
      tipo: 'academico',
      link_externo: '',
      image: null
    });

    component.onSubmit();

    expect(projetosServiceSpy.createProjeto).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/sucesso'], jasmine.objectContaining({
      queryParams: jasmine.objectContaining({
        message: 'Projeto publicado com sucesso!'
      })
    }));
  });

  it('deve navegar para tela de erro se houver falha na criação', () => {
    projetosServiceSpy.createProjeto.and.returnValue(throwError(() => ({ error: { detail: 'Erro 400' } })));

    component.projetoForm.setValue({
      titulo: 'Projeto Acadêmico Teste',
      subtitulo: 'Subtítulo',
      descricao: 'Descrição detalhada do projeto',
      conteudo: 'Conteúdo rico',
      data_realizacao: new Date('2026-08-01T00:00:00Z'),
      tipo: 'academico',
      link_externo: '',
      image: null
    });

    component.onSubmit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/erro'], jasmine.objectContaining({
      queryParams: jasmine.objectContaining({
        message: 'Erro ao salvar o projeto.'
      })
    }));
  });
});
