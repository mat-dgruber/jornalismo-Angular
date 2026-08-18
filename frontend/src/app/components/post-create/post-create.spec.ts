import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PostCreate } from './post-create';
import { BlogService } from '../../services/blog.service';
import { Post } from '../../services/post.model';

describe('PostCreateComponent', () => {
  let component: PostCreate;
  let fixture: ComponentFixture<PostCreate>;
  let blogServiceSpy: jasmine.SpyObj<BlogService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockPost: Post = {
    id: 1,
    title: 'Notícia de Teste',
    slug: 'noticia-de-teste',
    subtitle: 'Subtítulo da notícia',
    content: 'Conteúdo detalhado',
    author: '1',
    author_first_name: 'Maria',
    author_last_name: 'Izabela',
    category: 'Geral',
    image: 'https://mariaizabela.com.br/foto.webp',
    published_date: new Date('2026-08-01')
  };

  beforeEach(async () => {
    blogServiceSpy = jasmine.createSpyObj('BlogService', ['getUsers', 'getPost', 'createPost', 'updatePost']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    blogServiceSpy.getUsers.and.returnValue(of([{ id: 1, name: 'Admin' }]));
    blogServiceSpy.getPost.and.returnValue(of(mockPost));
    blogServiceSpy.createPost.and.returnValue(of(mockPost));
    blogServiceSpy.updatePost.and.returnValue(of(mockPost));

    await TestBed.configureTestingModule({
      imports: [PostCreate],
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
        { provide: BlogService, useValue: blogServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado em modo de criação por padrão', () => {
    expect(component).toBeTruthy();
    expect(component.isEditMode).toBe(false);
    expect(component.submitLabel).toBe('Publicar Notícia');
  });

  it('não deve enviar requisição se o formulário for inválido', () => {
    component.onSubmit();
    expect(blogServiceSpy.createPost).not.toHaveBeenCalled();
  });

  it('deve criar uma nova notícia via multipart quando o formulário for válido', () => {
    component.postForm.setValue({
      title: 'Nova Notícia Importante',
      subtitle: 'Subtítulo da notícia',
      content: 'Conteúdo completo',
      author: '1',
      image: null
    });

    component.onSubmit();

    expect(blogServiceSpy.createPost).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/sucesso'], jasmine.objectContaining({
      queryParams: jasmine.objectContaining({
        message: 'Notícia publicada com sucesso!'
      })
    }));
  });

  it('deve redirecionar para tela de erro se a criação falhar', () => {
    blogServiceSpy.createPost.and.returnValue(throwError(() => ({ error: { detail: 'Erro no servidor' } })));

    component.postForm.setValue({
      title: 'Nova Notícia Importante',
      subtitle: 'Subtítulo da notícia',
      content: 'Conteúdo completo',
      author: '1',
      image: null
    });

    component.onSubmit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/erro'], jasmine.objectContaining({
      queryParams: jasmine.objectContaining({
        message: 'Erro ao salvar a notícia.'
      })
    }));
  });

  it('deve anexar arquivo de imagem ao selecionar no input', () => {
    const file = new File(['dummy content'], 'noticia.webp', { type: 'image/webp' });
    const event = { target: { files: [file] } };

    component.onFileSelected(event);

    expect(component.selectedFile).toBe(file);
    expect(component.postForm.get('image')?.value).toBe(file);
  });
});
