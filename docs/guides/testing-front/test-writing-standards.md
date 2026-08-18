# 📐 Padrões de Escrita de Testes — Frontend (Angular 19 Standalone & Jasmine)

## 🎯 Estrutura Obrigatória (AAA Pattern)

Todo teste no frontend do portal deve seguir o padrão **Arrange, Act, Assert**:

```typescript
import { TestBed } from '@angular/core/testing';
import { SeoService } from './seo.service';
import { Title, Meta } from '@angular/platform-browser';

describe('SeoService', () => {
  let service: SeoService;
  let titleService: Title;
  let metaService: Meta;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeoService, Title, Meta]
    });
    service = TestBed.inject(SeoService);
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);
  });

  it('deve atualizar o título da página com o sufixo padrão do site', () => {
    // Arrange
    const config = { title: 'Sobre Mim' };

    // Act
    service.updateSeo(config);

    // Assert
    expect(titleService.getTitle()).toBe('Sobre Mim | Maria Izabela | Comunicação & Jornalismo');
  });

  it('deve adicionar metatag max-image-preview:large', () => {
    // Act
    service.updateSeo({});

    // Assert
    const robotsTag = metaService.getTag('name="robots"');
    expect(robotsTag?.content).toContain('max-image-preview:large');
  });
});
```

---

## 📝 Convenções de Nomenclatura

- **Suítes**: `describe('HomeComponent', () => { ... })`, `describe('PostDetailComponent', () => { ... })`.
- **Casos de Teste (`it`)**: Em português claro descrevendo a expectativa funcional.
- **Localização dos Arquivos**: Co-location no mesmo diretório do arquivo fonte (`seo.service.spec.ts`, `home.spec.ts`).

---

## ⚡ Testando Serviços com `HttpTestingController`

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PostService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve retornar lista de posts do blog via GET', () => {
    const mockPosts = [{ id: 1, title: 'Artigo Teste', slug: 'artigo-teste' }];

    service.getPosts().subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts[0].title).toBe('Artigo Teste');
    });

    const req = httpMock.expectOne('/api/blog/');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });
});
```
