# 🏛️ Arquitetura do Sistema e Visão Geral Técnica

Documentação técnica estrutural do ecossistema **Jornalismo Angular & Django REST**.

---

## 1. Visão Geral
O projeto é um portal de jornalismo, portfólio profissional e repositório de artigos e materiais acadêmicos de Maria Izabela. A arquitetura é desacoplada (*decoupled*), dividida em uma SPA reativa de alta performance com SSR no frontend e uma API REST robusta e sem estado (*stateless*) no backend.

```
[ Usuário / Web Browser ]
           │
     (HTTP/HTTPS)
           ▼
┌───────────────────────────────┐
│     Frontend (Angular 20)     │
│   - Angular SSR / Express     │
│   - PrimeNG UI                │
│   - Firebase Client SDK       │
│   - SeoService (JSON-LD)      │
└──────────────┬────────────────┘
               │
      (Bearer JWT Token)
               ▼
┌───────────────────────────────┐
│  Backend (Django 6.0 / DRF)   │
│   - Firebase Admin SDK (ADC)  │
│   - PostgreSQL Database       │
│   - Google Cloud Storage      │
│   - IsUnderUsageLimit Guard   │
└───────────────────────────────┘
```

---

## 2. Dependências Centrais

### Frontend (`frontend/package.json`)
* **Angular 20 & CDK**: Core da aplicação SPA e componentes acessíveis.
* **Angular Fire (`@angular/fire`)**: Integração direta com Firebase Authentication.
* **PrimeNG**: Componentes avançados de interface visual e formulários.
* **RxJS**: Gerenciamento de fluxos de dados e interceptors reativos.
* **Express (`@angular/ssr`)**: Renderização do lado do servidor para indexação otimizada de SEO.

### Backend (`backend/requirements.txt`)
* **Django 6.0 & Django REST Framework**: Framework web e serialização de dados.
* **firebase-admin**: Validação criptográfica de tokens JWT.
* **django-cors-headers**: Gerenciamento seguro de origens autorizadas (CORS).
* **psycopg2-binary**: Driver nativo de conexão com banco de dados PostgreSQL.
* **django-storages[google]**: Armazenamento em nuvem no Google Cloud Storage (Bucket Firebase).

---

## 3. Arquitetura e Fluxo de Dados

### 3.1. Autenticação & Zero-Trust
1. O usuário se autentica no frontend via Google Popup ou E-mail/Senha com o `AuthService`.
2. O Firebase Auth gera um token JWT de curta duração.
3. O `authInterceptor` insere automaticamente o cabeçalho `Authorization: Bearer <token>` em todas as requisições destinadas à URL da API (`environment.apiUrl`).
4. O backend decodifica o JWT no `FirebaseAuthentication` através de `auth.verify_id_token()`, extraindo o `uid` e associando o usuário do Django de forma implícita e segura.

### 3.2. Proteção Operacional (IsUnderUsageLimit)
* Métodos de escrita (`POST`, `PUT`, `PATCH`, `DELETE`) passam pela classe de permissão `IsUnderUsageLimit`.
* Essa classe checa o volume de dados consumido no PostgreSQL (cota de 100MB) e arquivos no GCS (cota de 1024MB), prevenindo negação de serviço e custos indesejados.

---

## 4. Exemplos de Uso

### 4.1. Consumo do Serviço de SEO no Frontend
```typescript
import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-meu-artigo',
  templateUrl: './meu-artigo.html'
})
export class MeuArtigoComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Título do Artigo de Jornalismo',
      description: 'Resumo sobre comunicação digital e cobertura de eventos.',
      type: 'article',
      url: '/artigos/titulo-do-artigo',
      image: 'assets/Imagens/banner.webp'
    });
  }
}
```

### 4.2. Definição de ViewSet Protegida no Backend Django
```python
from rest_framework import viewsets, permissions
from config.permissions import IsUnderUsageLimit
from .models import Artigo
from .serializers import ArtigoSerializer

class ArtigoViewSet(viewsets.ModelViewSet):
    queryset = Artigo.objects.all()
    serializer_class = ArtigoSerializer

    def get_permissions(self):
        # Mutações exigem usuário autenticado no Firebase e cota livre
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsUnderUsageLimit()]
        # Leituras são públicas para visitantes do portal
        return [permissions.AllowAny()]
```
