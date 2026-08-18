# 🎯 Índice Completo: Guia e Padrões de Testes do Frontend (Angular 19)

## 📋 Documentação Interconectada

Este é o **índice principal** que norteia a arquitetura, execução, escrita e manutenção de testes para a aplicação **jornalismo-Angular** (Portal Maria Izabela). A plataforma utiliza **Angular 19 Standalone**, **Karma / Jasmine**, **Signals / rxResource**, **PrimeNG** e **SSG/Prerendering**.

---

### **🚀 Estrutura dos Guias de Teste Frontend**

#### **1. Plano e Arquitetura de Testes**
📄 **[test-modernization-plan.md](./test-modernization-plan.md)**
- **Propósito**: Diretrizes arquiteturais para estruturação da pirâmide de testes no portal editorial.
- **Conteúdo**: Pirâmide de testes (~70% Services & Pipes, ~20% Componentes Standalone com TestBed, ~10% E2E / Rotas), mocking com `provideHttpClientTesting()`.

#### **2. Padrões de Escrita**
📄 **[test-writing-standards.md](./test-writing-standards.md)**
- **Propósito**: Convenções canônicas para testes em Angular 19 Standalone.
- **Conteúdo**: Padrão **AAA** (*Arrange, Act, Assert*), sintaxe Jasmine (`describe`, `it`, `expect`), testes de `SeoService`, `PostService`, componentes (`HomeComponent`, `ArtigosComponent`, `BlogComponent`, `ProjetosComponent`, `MateriaisComponent`).

#### **3. Guia de Execução**
📄 **[test-execution-guide.md](./test-execution-guide.md)**
- **Propósito**: Comandos para rodar a suíte no terminal e em CI/CD.
- **Conteúdo**: `npm test` (Karma + ChromeHeadless), `npm run build` (validação de build e SSG), relatórios de cobertura.

#### **4. Troubleshooting e Resolução de Problemas**
📄 **[troubleshooting.md](./troubleshooting.md)**
- **Propósito**: Diagnóstico para problemas comuns em testes Angular (Karma Headless, injeção de dependências no `TestBed`, `HttpTestingController`).

---

## 🚀 Comandos Essenciais

```bash
# Executar testes unitários e de componentes em modo headless
cd frontend && npm test -- --watch=false --browsers=ChromeHeadless

# Executar testes em modo interativo (Watch)
cd frontend && npm test

# Checagem de tipos TypeScript
cd frontend && npx tsc --noEmit
```
