# 🔧 Troubleshooting e Resolução de Problemas em Testes — Frontend (Angular 19)

## 🚨 Problemas Comuns e Soluções

---

### **1. Erro de Conexão com ChromeHeadless no Karma**

#### **Sintoma**:
Karma falha ao iniciar o navegador headless no terminal ou CI.

#### **Solução**:
Execute o comando explicitando o ChromeHeadless:
```bash
cd frontend && npm test -- --watch=false --browsers=ChromeHeadless
```

---

### **2. Erro de Requisição HTTP não Interceptada no Teste**

#### **Sintoma**:
`Expected no open requests, found 1 request(s)` no bloco `afterEach()`.

#### **Solução**:
Use `httpMock.expectOne('/api/...')` e responda a requisição com `req.flush(dadosMockados)`.

---

### **3. Injeção de Dependências em Componentes Standalone**

#### **Sintoma**:
`NullInjectorError: No provider for ActivatedRoute` ou `HttpClient`.

#### **Solução**:
Adicione os providers no `TestBed`:
```typescript
await TestBed.configureTestingModule({
  imports: [HomeComponent],
  providers: [
    provideHttpClient(),
    provideHttpClientTesting(),
    provideRouter([])
  ]
}).compileComponents();
```
