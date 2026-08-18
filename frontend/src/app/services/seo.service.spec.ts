import { TestBed } from '@angular/core/testing';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService, SeoConfig } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let titleService: Title;
  let metaService: Meta;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SeoService,
        Title,
        Meta
      ]
    });

    service = TestBed.inject(SeoService);
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);
    document = TestBed.inject(DOCUMENT);
  });

  it('deve ser instanciado com sucesso', () => {
    expect(service).toBeTruthy();
  });

  it('deve definir o título padrão quando nenhum título customizado for fornecido', () => {
    service.updateSeo({});
    expect(titleService.getTitle()).toBe('Maria Izabela | Comunicação & Jornalismo');
  });

  it('deve formatar o título da página com o sufixo da marca quando informado', () => {
    const config: SeoConfig = { title: 'Artigos Publicados' };
    service.updateSeo(config);
    expect(titleService.getTitle()).toBe('Artigos Publicados | Maria Izabela | Comunicação & Jornalismo');
  });

  it('deve atualizar metatags padrão de description, keywords, author e robots snippet', () => {
    const config: SeoConfig = {
      description: 'Análises profundas sobre sociedade e comunicação.',
      keywords: 'jornalismo, midia, comunicacao'
    };

    service.updateSeo(config);

    expect(metaService.getTag('name="description"')?.content).toBe(config.description!);
    expect(metaService.getTag('name="keywords"')?.content).toBe(config.keywords!);
    expect(metaService.getTag('name="author"')?.content).toBe('Maria Izabela');
    expect(metaService.getTag('name="robots"')?.content).toContain('max-image-preview:large');
  });

  it('deve converter caminhos relativos de imagem em URLs absolutas para OpenGraph e Twitter', () => {
    const config: SeoConfig = {
      title: 'Post de Teste',
      image: 'assets/Imagens/minha-imagem.webp'
    };

    service.updateSeo(config);

    const ogImage = metaService.getTag('property="og:image"');
    const twitterImage = metaService.getTag('name="twitter:image"');

    expect(ogImage?.content).toBe('https://mariaizabela.com.br/assets/Imagens/minha-imagem.webp');
    expect(twitterImage?.content).toBe('https://mariaizabela.com.br/assets/Imagens/minha-imagem.webp');
  });

  it('deve manter URLs de imagem absolutas externas inalteradas', () => {
    const externalUrl = 'https://storage.googleapis.com/meu-bucket/imagem.webp';
    const config: SeoConfig = { image: externalUrl };

    service.updateSeo(config);

    expect(metaService.getTag('property="og:image"')?.content).toBe(externalUrl);
  });

  it('deve injetar script JSON-LD NewsArticle quando type for "article"', () => {
    const config: SeoConfig = {
      title: 'Reportagem Especial',
      description: 'Investigação aprofundada',
      type: 'article',
      url: '/post/reportagem-especial'
    };

    service.updateSeo(config);

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();

    const parsedJson = JSON.parse(script!.textContent || '{}');
    expect(parsedJson['@type']).toBe('NewsArticle');
    expect(parsedJson.headline).toContain('Reportagem Especial');
    expect(parsedJson.author?.name).toBe('Maria Izabela');
  });

  it('deve atualizar o link rel="canonical" no documento', () => {
    const config: SeoConfig = { url: '/projetos' };
    service.updateSeo(config);

    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical).toBeTruthy();
    expect(canonical?.getAttribute('href')).toBe('https://mariaizabela.com.br/projetos');
  });
});
