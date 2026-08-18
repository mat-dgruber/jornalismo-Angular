# 📚 Padrão de Documentação de Domínio (jornalismo-Angular)

Esta especificação define a instrução sistemática para a documentação e evolução dos módulos de domínio do portal **jornalismo-Angular** (Maria Izabela).

---

## 🏛️ 1. Domínios do Sistema

A plataforma é composta por 5 domínios centrais:

```
docs/domains/
├── blog/             # Ensaios, reflexões e artigos autorais de opinião
├── artigos/          # Reportagens e matérias publicadas em veículos e portais externos
├── projetos/         # Projetos acadêmicos (TCC, pesquisa) e iniciativas de comunicação
├── materiais/        # E-books, cartilhas e materiais educativos para download
└── auth_admin/       # Autenticação Firebase, permissões Django e gestão de conteúdo
```

---

## 📁 2. Estrutura Padrão por Domínio

Cada domínio possui três arquivos essenciais:

```
docs/domains/{nome_do_dominio}/
├── overview.md         # Visão Geral do Domínio (Propósito, Contexto e Entidades)
├── business-rules.md   # Regras de Negócio e Permissões de Acesso
└── tech-design.md      # Design Técnico (Models Django, Serializers, Componentes Angular e Endpoints)
```

---

## 📝 3. Modelos Estruturais

### 3.1. `overview.md`
* **Propósito**: O que o módulo faz, para quem se destina e como se integra ao portal.
* **Entidades Principais**: Diagrama de entidades e campos essenciais (`Post`, `Artigo`, `Projeto`, `Material`).

### 3.2. `business-rules.md`
* **Visibilidade Pública vs. Rascunho**: Controle de publicação (`is_published`, `status`).
* **Geração Automática de Slugs**: Normalização de títulos sem acentos para URLs amigáveis.
* **Segurança**: Operações de mutação (`POST`, `PUT`, `DELETE`) restritas à administradora autenticada.

### 3.3. `tech-design.md`
* **Backend (Django 5 REST)**: Models, `serializers.ModelSerializer`, `viewsets.ModelViewSet` ou `APIView`.
* **Frontend (Angular 19)**: Serviços (`*Service`), Models TypeScript, Componentes Standalone e SEO dinâmico (`SeoService.updateSeo()`).
