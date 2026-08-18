# 🎯 Arquitetura e Plano de Padronização de Testes — Frontend (Angular 19)

## 📊 Visão Geral da Arquitetura de Testes

O frontend **jornalismo-Angular** utiliza **Angular 19 Standalone Components**, **PrimeNG**, **Signals / rxResource**, e **Prerender SSG**.

A suíte de testes é organizada em três camadas:

---

## 🏗️ Pirâmide de Testes Frontend

```
        / \
       /   \     10% E2E / Rotas e Prerender (Validação de Build e Navegação)
      / E2E \
     /-------\   20% Component Integration Tests (TestBed Standalone + DOM Binding)
    / Integra \
   /-----------\ 70% Unit Tests (SeoService, PostService, ArtigoService, ProjetoService)
  /  Unitários  \
 /---------------\
```

### **1. Testes Unitários de Serviços (~70%)**
- **Escopo**: `SeoService` (metatags, OpenGraph, Schema JSON-LD, Canonical), `PostService`, `ArtigoService`, `ProjetoService`, `MaterialService`.
- **Isolamento**: Mock de chamadas HTTP via `provideHttpClientTesting()`.

### **2. Testes de Componentes Standalone (~20%)**
- **Escopo**: `HomeComponent`, `BlogComponent`, `ArtigosComponent`, `ProjetosComponent`, `MateriaisComponent`, `HeaderComponent`.
- **Validação**: Renderização de listas, skeletons durante carregamento e estados de lista vazia (`empty-state-editorial`).

### **3. Validação de Build e SSG (~10%)**
- **Escopo**: Execução de `npm run build` garantindo geração estática limpa das 9 rotas públicas.
