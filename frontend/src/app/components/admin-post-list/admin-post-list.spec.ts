import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { AdminPostList } from './admin-post-list';
import { BlogService } from '../../services/blog.service';
import { Post } from '../../services/post.model';

describe('AdminPostListComponent', () => {
  let component: AdminPostList;
  let fixture: ComponentFixture<AdminPostList>;
  let blogServiceSpy: jasmine.SpyObj<BlogService>;
  let confirmationService: ConfirmationService;

  const mockPosts: Post[] = [
    {
      id: 1,
      title: 'Notícia 1',
      slug: 'noticia-1',
      subtitle: 'Sub 1',
      content: 'Cont 1',
      author: '1',
      author_first_name: 'Maria',
      author_last_name: 'Izabela',
      category: 'Geral',
      image: 'https://mariaizabela.com.br/foto.webp',
      published_date: new Date('2026-08-01')
    }
  ];

  beforeEach(async () => {
    blogServiceSpy = jasmine.createSpyObj('BlogService', ['getPosts', 'deletePost']);
    blogServiceSpy.getPosts.and.returnValue(of(mockPosts));
    blogServiceSpy.deletePost.and.returnValue(of(undefined as void));

    await TestBed.configureTestingModule({
      imports: [AdminPostList],
      providers: [
        provideRouter([]),
        ConfirmationService,
        { provide: BlogService, useValue: blogServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPostList);
    component = fixture.componentInstance;
    confirmationService = fixture.debugElement.injector.get(ConfirmationService);
    fixture.detectChanges();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve listar os posts na tabela administrativa', () => {
    expect(component.posts.length).toBe(1);
    expect(blogServiceSpy.getPosts).toHaveBeenCalled();
  });

  it('deve abrir a caixa de diálogo de confirmação ao tentar excluir um post', () => {
    spyOn(confirmationService, 'confirm').and.callFake((config: any) => {
      config.accept();
      return confirmationService;
    });

    component.deletePost('noticia-1');

    expect(confirmationService.confirm).toHaveBeenCalled();
    expect(blogServiceSpy.deletePost).toHaveBeenCalledWith('noticia-1');
  });
});
