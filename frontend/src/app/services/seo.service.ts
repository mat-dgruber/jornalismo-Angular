import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);

  private siteTitle = 'Maria Izabela | Jornalismo & Teologia';
  private defaultDescription = 'Portfólio de Maria Izabela. Artigos, materiais e projetos sobre Jornalismo e Teologia.';

  updateSeo(config: {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
  }) {
    const title = config.title ? `${config.title} | ${this.siteTitle}` : this.siteTitle;
    const description = config.description || this.defaultDescription;
    const keywords = config.keywords || 'jornalismo, teologia, maria izabela, artigos, portfólio, fé e sociedade';
    const image = config.image || 'assets/Imagens/banner-jornalismo-maria-izabela.png';
    const url = config.url ? `https://mariaizabela.com.br${config.url}` : 'https://mariaizabela.com.br';
    const type = config.type || 'website';

    this.titleService.setTitle(title);

    // Standard Meta Tags
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'keywords', content: keywords });

    // Open Graph / Facebook
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ property: 'og:url', content: url });
    this.metaService.updateTag({ property: 'og:type', content: type });

    // Twitter
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: image });

    // Canonical
    this.updateCanonicalUrl(url);
  }

  private updateCanonicalUrl(url: string) {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (link === null) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
