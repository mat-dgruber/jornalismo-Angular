// MARK: - Imports & Dependencies
import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

// MARK: - Types & Interfaces
/**
 * Configuração de metadados para otimização de motores de busca (SEO) e compartilhamento social.
 */
export interface SeoConfig {
  /** Título da página ou artigo. */
  title?: string;
  /** Descrição resumida para snippets do Google e OpenGraph. */
  description?: string;
  /** Palavras-chave separadas por vírgula. */
  keywords?: string;
  /** Caminho relativo ou absoluto da imagem de destaque (banner/thumbnail). */
  image?: string;
  /** Caminho relativo canônico da página (ex: '/blog/meu-post'). */
  url?: string;
  /** Tipo de entidade OpenGraph ('website', 'article', etc.). */
  type?: 'website' | 'article' | string;
}

// MARK: - Service Implementation
/**
 * Serviço responsável por gerenciar dinamicamente as tags de SEO, metadados OpenGraph/Twitter Cards,
 * links canônicos e dados estruturados (JSON-LD Schema.org) da aplicação Angular.
 */
@Injectable({
  providedIn: 'root'
})
export class SeoService {
  // MARK: - Injected Dependencies
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly document = inject(DOCUMENT);

  // MARK: - Default Constants
  private readonly siteTitle = 'Maria Izabela | Comunicação & Jornalismo';
  private readonly defaultDescription =
    'Portfólio de Maria Izabela. Confira artigos, projetos e materiais sobre comunicação, jornalismo e teologia.';

  // MARK: - Public API
  /**
   * Atualiza as meta tags globais, título da aba do navegador, tags OpenGraph/Twitter e JSON-LD.
   *
   * @param {SeoConfig} config Objeto de configuração contendo os metadados da rota atual.
   */
  updateSeo(config: SeoConfig): void {
    const title = config.title ? `${config.title} | ${this.siteTitle}` : this.siteTitle;
    const description = config.description || this.defaultDescription;
    const keywords =
      config.keywords ||
      'comunicação digital, jornalismo, maria izabela, portfólio, marketing de conteúdo, teologia';

    // Garante que URLs de imagem relativas sejam convertidas em absolutas para compatibilidade com crawlers
    const rawImage = config.image || 'assets/Imagens/banner-jornalismo-maria-izabela.webp';
    const image = rawImage.startsWith('http')
      ? rawImage
    : `https://mariaizabela.com.br/${rawImage.replace(/^\//, '')}`;

    const url = config.url ? `https://mariaizabela.com.br${config.url}` : 'https://mariaizabela.com.br';
    const type = config.type || 'website';

    // Atualização do título
    this.titleService.setTitle(title);

    // MARK: - Standard Meta Tags
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'keywords', content: keywords });
    this.metaService.updateTag({ name: 'author', content: 'Maria Izabela' });
    this.metaService.updateTag({
      name: 'robots',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    });

    // MARK: - Open Graph (Facebook, WhatsApp, LinkedIn)
    this.metaService.updateTag({ property: 'og:site_name', content: this.siteTitle });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ property: 'og:url', content: url });
    this.metaService.updateTag({ property: 'og:type', content: type });

    // MARK: - Twitter Cards
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: image });

    // MARK: - Canonical URL
    this.updateCanonicalUrl(url);

    // MARK: - Structured Data (JSON-LD Schema.org)
    if (config.type === 'article') {
      this.updateJsonLd({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: title,
        description: description,
        image: [image],
        url: url,
        author: {
          '@type': 'Person',
          name: 'Maria Izabela',
          url: 'https://mariaizabela.com.br',
          jobTitle: 'Jornalista e Comunicadora Digital'
        },
        publisher: {
          '@type': 'Person',
          name: 'Maria Izabela',
          url: 'https://mariaizabela.com.br'
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url
        },
        inLanguage: 'pt-BR'
      });
    }
  }

  // MARK: - Helper Methods
  /**
   * Insere ou atualiza a tag de script application/ld+json no cabeçalho do documento HTML.
   *
   * @param {Record<string, unknown>} data Objeto de dados compatível com a especificação Schema.org.
   */
  private updateJsonLd(data: Record<string, unknown>): void {
    let script: HTMLScriptElement | null = this.document.querySelector('script[type="application/ld+json"]');
    if (script === null) {
      script = this.document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      this.document.head.appendChild(script);
    }
    script.text = JSON.stringify(data);
  }

  /**
   * Insere ou atualiza o elemento link rel="canonical" no <head> da página.
   *
   * @param {string} url URL canônica absoluta da página.
   */
  private updateCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (link === null) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
