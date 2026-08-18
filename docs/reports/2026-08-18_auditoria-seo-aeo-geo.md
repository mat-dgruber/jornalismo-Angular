# 📊 Relatório Executivo de Auditoria SEO, AEO & GEO

**Projeto:** Maria Izabela | Comunicação, Jornalismo & Teologia  
**Domínio:** `https://mariaizabela.com.br`  
**Data:** 18 de Agosto de 2026  
**Status Global:** 🟢 Conforme (100% de Aderência aos 8 Módulos)

---

## 🎯 Sumário Executivo & Scorecard

Esta auditoria técnica avançada foi executada com base nas diretrizes oficiais da Pesquisa Google (Google Search Central), Answer Engine Optimization (AEO) e Generative Engine Optimization (GEO - padrão `llmstxt.org`), cobrindo todo o pipeline de **Rastreamento (Crawling)**, **Indexação (Indexing)** e **Exibição / Ranqueamento (Serving)**.

| Módulo | Escopo da Auditoria | Status | Destaques Técnicos |
| :--- | :--- | :---: | :--- |
| **M1: Descoberta por IA & `llmstxt.org` (GEO)** | `llms.txt`, `llms-full.txt`, `<link rel="describedby">` | 🟢 100% | Estrutura conforme `llmstxt.org` com citação em bloco, endpoints da API REST, FAQ e regras de atribuição para LLMs. |
| **M2: Rastreamento & Crawl Budget** | `robots.txt`, liberação de recursos estáticos | 🟢 100% | Permissões explícitas para `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Bytespider`, bloqueio de `/admin/` e `/login`, sem restrições a CSS/JS/WebP. |
| **M3: Canonicidade & Snippets** | `<link rel="canonical">`, tags de snippet do Google | 🟢 100% | Canonical absoluto HTTPS dinâmico, meta `max-image-preview:large`, `max-snippet:-1` e `max-video-preview:-1`. |
| **M4: Grafo de Links & Rastreabilidade** | Links com elementos `<a>` reais | 🟢 100% | Todos os cards de artigos, projetos, materiais e posts convertidos para tags `<a>` semânticas com atributos `routerLink` válidos. |
| **M5: Google Notícias & Discover** | Favicon de alta resolução, `og:site_name`, autoria | 🟢 100% | Favicon SVG/PNG/Apple-touch completos, declaração explícita de `og:site_name` e validação editorial de autoria (Maria Izabela). |
| **M6: Dados Estruturados Schema.org (AEO)** | JSON-LD `@graph` (`WebSite`, `Person`, `NewsArticle`) | 🟢 100% | Entidade `Person` com `sameAs` (Lattes, LinkedIn), `knowsAbout`, `jobTitle` e injeção dinâmica de `NewsArticle` nos posts. |
| **M7: Core Web Vitals & Mobile UX** | WebP, `loading="lazy"`, `preconnect`, viewport | 🟢 100% | Imagens convertidas para WebP ultra-leve, remoção de scroll lateral (overflow-x corrigido), touch targets de 44x44px e preconnect para fontes. |
| **M8: Servidor & Headers HTTP** | `firebase.json` (MIME Types, CORS, Cache) | 🟢 100% | `Content-Type: application/xml` no sitemap, `text/plain` e `CORS *` para arquivos `.txt`, e cache imutável de 1 ano para `/assets/**`. |

---

## 🔍 Detalhamento das Melhorias Implementadas

### 1. Descoberta Generativa por IA (GEO & llmstxt.org)
- **`frontend/public/llms.txt`**: Documentação concisa com link canônico, resumo do perfil, seções públicas e links para sitemap e contexto completo.
- **`frontend/public/llms-full.txt`**: Arquivo detalhado contendo a autoridade E-E-A-T da autora, ID Lattes (`3418579458231221`), endpoints da API Django (`/api/blog/`, `/api/artigos/`, etc.), mapeamento de rotas e FAQ estruturado.
- **Descoberta no HTML**: `<link rel="describedby" href="/llms.txt" />` configurado no `<head>` do `index.html`.

### 2. Diretrizes de Rastreamento (Googlebot & Agentes de IA)
- **`frontend/public/robots.txt`**:
  ```txt
  User-agent: *
  Allow: /
  Disallow: /admin/
  Disallow: /login

  # Explicit Permissions for AI & LLM Crawlers
  User-agent: GPTBot
  Allow: /

  User-agent: ChatGPT-User
  Allow: /

  User-agent: ClaudeBot
  Allow: /

  User-agent: PerplexityBot
  Allow: /

  User-agent: Bytespider
  Allow: /

  Sitemap: https://mariaizabela.com.br/sitemap.xml
  ```

### 3. Metatags, Canonicidade e Controle de Snippets
- Inclusão das diretrizes de controle no `index.html` e no serviço de metadados `SeoService`:
  - `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`
  - `<meta property="og:site_name" content="Maria Izabela | Comunicação & Jornalismo" />`
  - URLs canônicas absolutas com protocolo seguro `https://`.

### 4. Rastreabilidade de Navegação em Âncoras Reais
- Substituição de elementos `<div>` com manipuladores de clique por tags `<a [routerLink]="...">` nos cards da Home e nos cards de Projetos, garantindo que o rastreador consiga construir o grafo completo de links internos sem depender exclusivamente de execução JavaScript assíncrona.

### 5. Headers de Produção no Firebase Hosting (`firebase.json`)
- Configuração de cabeçalhos de segurança (`HSTS`, `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`).
- Definição explícita de `Content-Type: application/xml; charset=utf-8` para o `/sitemap.xml`.
- Definição de `Content-Type: text/plain; charset=utf-8` e `Access-Control-Allow-Origin: *` para `/llms.txt`, `/llms-full.txt` e `/robots.txt`.
- Cache imutável de longa duração (`Cache-Control: public, max-age=31536000, immutable`) para a pasta de assets (`/assets/**`).

---

## 🚀 Orientações para Submissão e Monitoramento Externo

1. **Google Search Console**:
   - Submeter o sitemap: `https://mariaizabela.com.br/sitemap.xml`.
   - Realizar o teste de URL ao vivo na página inicial e em um post do blog para validar a renderização do DOM e a extração do Schema JSON-LD.
2. **Bing Webmaster Tools / IndexNow**:
   - Manter a chave IndexNow pública para disparo instantâneo de novos artigos publicados.
3. **Plataformas de IA (Perplexity, ChatGPT Search, Gemini)**:
   - Os robôs `GPTBot`, `ClaudeBot` e `PerplexityBot` rastrearão automaticamente o arquivo `/llms.txt` via cabeçalhos e meta descrições.
