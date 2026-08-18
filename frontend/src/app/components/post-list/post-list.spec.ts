import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PostList } from './post-list';
import { BlogService } from '../../services/blog.service';
import { Post } from '../../services/post.model';

describe('PostListComponent', () => {
  let component: PostList;
  let fixture: ComponentFixture<PostList>;
  let blogServiceSpy: jasmine.SpyObj<BlogService>;

  const mockPosts: Post[] = [
    {
      id: 1,
      title: 'Post Teste',
      slug: 'post-teste',
      subtitle: 'Subtítulo',
      content: '<p>Conteúdo formatado em HTML</p>',
      author: '1',
      author_first_name: 'Maria',
      author_last_name: 'Izabela',
      category: 'Geral',
      image: 'https://mariaizabela.com.br/imagem.webp',
      published_date: new Date('2026-08-01')
    }
  ];

  beforeEach(async () => {
    blogServiceSpy = jasmine.createSpyObj('BlogService', ['getPosts']);
    blogServiceSpy.getPosts.and.returnValue(of(mockPosts));

    await TestBed.configureTestingModule({
      imports: [PostList],
      providers: [
        provideRouter([]),
        { provide: BlogService, useValue: blogServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os posts no Signal e desativar o carregamento', () => {
    expect(component.posts().length).toBe(1);
    expect(component.posts()[0].title).toBe('Post Teste');
    expect(component.isLoading).toBe(false);
  });

  it('deve desativar o carregamento caso a requisição de posts falhe', () => {
    blogServiceSpy.getPosts.and.returnValue(throwError(() => new Error('Falha')));
    component.loadPosts();
    expect(component.isLoading).toBe(false);
  });
});
