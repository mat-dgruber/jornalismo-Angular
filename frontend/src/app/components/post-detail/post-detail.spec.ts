import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PostDetail } from './post-detail';
import { BlogService } from '../../services/blog.service';
import { SeoService } from '../../services/seo.service';
import { Post } from '../../services/post.model';

describe('PostDetailComponent', () => {
  let component: PostDetail;
  let fixture: ComponentFixture<PostDetail>;
  let blogServiceSpy: jasmine.SpyObj<BlogService>;
  let seoServiceSpy: jasmine.SpyObj<SeoService>;

  const mockPost: Post = {
    id: 1,
    title: 'Reportagem Especial',
    slug: 'reportagem-especial',
    subtitle: 'Uma investigação detalhada',
    content: 'Conteúdo da reportagem investigativa',
    author: '1',
    author_first_name: 'Maria',
    author_last_name: 'Izabela',
    category: 'Especial',
    image: 'https://mariaizabela.com.br/imagem.webp',
    published_date: new Date('2026-08-01')
  };

  beforeEach(async () => {
    blogServiceSpy = jasmine.createSpyObj('BlogService', ['getPost']);
    seoServiceSpy = jasmine.createSpyObj('SeoService', ['updateSeo']);

    blogServiceSpy.getPost.and.returnValue(of(mockPost));

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => key === 'slug' ? 'reportagem-especial' : null
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [PostDetail],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: BlogService, useValue: blogServiceSpy },
        { provide: SeoService, useValue: seoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve buscar o post pelo slug informado na rota', () => {
    expect(blogServiceSpy.getPost).toHaveBeenCalledWith('reportagem-especial');
  });

  it('deve atualizar o SEO quando o recurso carregar o post', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    TestBed.flushEffects();

    expect(seoServiceSpy.updateSeo).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Reportagem Especial',
      description: 'Uma investigação detalhada',
      url: '/post/reportagem-especial',
      type: 'article'
    }));
  });
});
