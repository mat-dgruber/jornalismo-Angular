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

  private siteTitle = 'Maria Izabela | Comunicação & Jornalismo';
  private defaultDescription = 'Portfólio de Maria Izabela. Confira artigos, projetos e materiais sobre comunicação, jornalismo e teologia.';

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
    const keywords = config.keywords || 'comunicação digital, jornalismo, maria izabela, portfólio, marketing de conteúdo, teologia';
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

    // Dynamic JSON-LD (Structured Data)
    if (config.type === 'article') {
      this.updateJsonLd({
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": title,
        "description": description,
        "image": image,
        "url": url,
        "author": {
          "@type": "Person",
          "name": "Maria Izabela"
        }
      });
    }
  }

  private updateJsonLd(data: any) {
    let script: HTMLScriptElement | null = this.document.querySelector('script[type="application/ld+json"]');
    if (script === null) {
      script = this.document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      this.document.head.appendChild(script);
    }
    script.text = JSON.stringify(data);
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
