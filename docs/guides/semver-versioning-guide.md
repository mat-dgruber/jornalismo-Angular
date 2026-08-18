# 🏷️ Guia de Versionamento Semântico (SemVer) — jornalismo-Angular

Este guia estabelece a política e padrão de versionamento semântico adotado no projeto **jornalismo-Angular** (Portal Maria Izabela).

---

## 📌 1. Estrutura do SemVer

O padrão **SemVer (Semantic Versioning 2.0.0)** segue o formato:

```
MAJOR.MINOR.PATCH
```

Exemplo: `1.2.0`

### 1.1 Regras de Incremento

| Componente | Quando Incrementar | Exemplos no jornalismo-Angular |
| :--- | :--- | :--- |
| **MAJOR (X.0.0)** | Quebras de compatibilidade (breaking changes) ou reescrita arquitetural. | Migração de framework (Angular 18 ➔ 19 ➔ 20), reestruturação radical do schema de banco Django ou mudança de endpoints quebrando clientes. |
| **MINOR (0.X.0)** | Novas funcionalidades compatíveis com a versão anterior. | Adição do módulo de Materiais/E-books, novo filtro de pesquisa de artigos, suporte a novos crawlers de IA em `llms.txt`. |
| **PATCH (0.0.X)** | Correções de bugs, ajustes de CSS/UI ou pequenas melhorias. | Correção de scroll lateral no mobile, ajuste de proporção da logo, otimização de imagens para WebP, correções de tipagem TypeScript. |

---

## 🎯 2. Versionamento no Monorepo

No **jornalismo-Angular**, o controle de versão está atrelado aos arquivos:

1. **Frontend (`frontend/package.json`)**:
   ```json
   {
     "name": "jornalismo-angular",
     "version": "1.2.0"
   }
   ```
2. **Tags de Release no Git**:
   ```bash
   git tag -a v1.2.0 -m "release: versao 1.2.0 com otimizacao SEO/GEO e melhorias mobile"
   git push origin v1.2.0
   ```
3. **Registro de Mudanças**:
   - Todo release deve conter notas de versão ou relatórios de sessão em `docs/commits/`.
