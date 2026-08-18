import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Blog } from './blog';
import { SeoService } from '../../services/seo.service';
import { BlogService } from '../../services/blog.service';

describe('BlogComponent', () => {
  let component: Blog;
  let fixture: ComponentFixture<Blog>;
  let seoServiceSpy: jasmine.SpyObj<SeoService>;

  beforeEach(async () => {
    seoServiceSpy = jasmine.createSpyObj('SeoService', ['updateSeo']);
    const blogServiceMock = {
      getPosts: () => of([])
    };

    await TestBed.configureTestingModule({
      imports: [Blog],
      providers: [
        provideRouter([]),
        { provide: SeoService, useValue: seoServiceSpy },
        { provide: BlogService, useValue: blogServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Blog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve atualizar o SEO com metadados do blog', () => {
    expect(seoServiceSpy.updateSeo).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Blog',
      url: '/blog'
    }));
  });
});
