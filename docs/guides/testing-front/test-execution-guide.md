# 📋 Guia de Execução de Testes — Frontend (Angular 19)

## 🚀 Comandos Essenciais de Execução

Execute a partir do diretório `frontend/`:

---

### **1. Checagem Estática de Tipos (TypeScript)**

```bash
cd frontend
npx tsc --noEmit
```

---

### **2. Testes Unitários e de Componentes (Karma + Jasmine)**

```bash
# Executar todos os testes em modo headless (CI / Validação Única)
cd frontend && npm test -- --watch=false --browsers=ChromeHeadless

# Executar em modo interativo (Watch durante desenvolvimento)
cd frontend && npm test

# Executar com relatório de cobertura de código
cd frontend && npm test -- --code-coverage --watch=false --browsers=ChromeHeadless
```

#### **Execução Focada (Single Spec / Test)**
Utilize `fdescribe` ou `fit` no Jasmine para focar em uma suíte ou teste específico:

```typescript
fdescribe('SeoService', () => {
  fit('deve injetar a tag canonical absoluta com HTTPS', () => { ... });
});
```

---

### **3. Validação de Build e SSR/SSG Prerendering**

```bash
# Executa pré-build de SEO e compilação das 9 rotas prerenderizadas
cd frontend && npm run build
```
