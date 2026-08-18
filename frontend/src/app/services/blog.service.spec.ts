import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { BlogService } from './blog.service';
import { Post } from './post.model';
import { environment } from '../../environments/environment';

describe('BlogService', () => {
  let service: BlogService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/blog/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BlogService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(BlogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar a lista de posts do blog via GET', () => {
    const mockPosts: Partial<Post>[] = [
      { id: 1, title: 'Primeiro Post', slug: 'primeiro-post' },
      { id: 2, title: 'Segundo Post', slug: 'segundo-post' }
    ];

    service.getPosts().subscribe(posts => {
      expect(posts.length).toBe(2);
      expect(posts[0].title).toBe('Primeiro Post');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('deve buscar um post específico por slug via GET', () => {
    const mockPost: Partial<Post> = {
      id: 1,
      title: 'Post Detalhado',
      slug: 'post-detalhado',
      content: '<p>Conteúdo completo do post</p>'
    };

    service.getPost('post-detalhado').subscribe(post => {
      expect(post.title).toBe('Post Detalhado');
      expect(post.slug).toBe('post-detalhado');
    });

    const req = httpMock.expectOne(`${baseUrl}post-detalhado/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPost);
  });

  it('deve criar um novo post via POST com FormData', () => {
    const formData = new FormData();
    formData.append('title', 'Novo Artigo');

    const mockResponse: Partial<Post> = { id: 3, title: 'Novo Artigo', slug: 'novo-artigo' };

    service.createPost(formData).subscribe(post => {
      expect(post.id).toBe(3);
      expect(post.title).toBe('Novo Artigo');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('deve atualizar um post existente via PUT com FormData', () => {
    const formData = new FormData();
    formData.append('title', 'Artigo Atualizado');

    const mockResponse: Partial<Post> = { id: 1, title: 'Artigo Atualizado', slug: 'artigo-atualizado' };

    service.updatePost('artigo-atualizado', formData).subscribe(post => {
      expect(post.title).toBe('Artigo Atualizado');
    });

    const req = httpMock.expectOne(`${baseUrl}artigo-atualizado/`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('deve excluir um post via DELETE', () => {
    service.deletePost('post-para-deletar').subscribe(() => {
      // Callback de sucesso
    });

    const req = httpMock.expectOne(`${baseUrl}post-para-deletar/`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('deve buscar usuários/autores via GET', () => {
    const mockUsers = [{ id: 1, username: 'mariaizabela' }];

    service.getUsers().subscribe(users => {
      expect(users.length).toBe(1);
      expect(users[0].username).toBe('mariaizabela');
    });

    const req = httpMock.expectOne(`${baseUrl}users/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
