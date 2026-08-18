# CLAUDE.md — Diretrizes de Engenharia e Harness (jornalismo-Angular)

## 📌 Visão Geral do Projeto
- **Portal**: Maria Izabela | Comunicação, Jornalismo & Teologia
- **Frontend**: Angular 19 Standalone, PrimeNG UI, Signals / rxResource, Prerender SSG, Firebase Hosting.
- **Backend**: Python 3.12+, Django 5 + Django REST Framework, Google Cloud Run.
- **Domínios**: `blog` (ensaios), `artigos` (reportagens), `projetos` (iniciativas), `materiais` (e-books), `config` (auth & admin).

---

## 🚀 Comandos Operacionais

### Frontend (Angular 19)
- **Build de Produção & SSG**: `cd frontend && npm run build`
- **Servidor de Desenvolvimento**: `cd frontend && npm start`
- **Testes Unitários & Componentes**: `cd frontend && npm test -- --watch=false --browsers=ChromeHeadless`
- **Auditoria de Segurança**: `cd frontend && npm run security-audit`

### Backend (Django 5 REST)
- **Servidor de Desenvolvimento**: `cd backend && python manage.py runserver`
- **Executar Testes**: `cd backend && python manage.py test`
- **Migrações**: `cd backend && python manage.py makemigrations && python manage.py migrate`

### Governança & Memória
- **Sincronização de Memória**: `./.claude/sync-claude-memory.sh pull` / `./.claude/sync-claude-memory.sh push`

---

## 🌐 Idioma & Convenções de Código
- **Comunicação, Respostas e Documentação**: Português do Brasil (**pt-BR**).
- **Código, Variáveis e Commits**: Inglês (**EN-US**).
- **Formato de Commits**: Padrão **Conventional Commits** (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`).

---

## 🧠 graphify (Knowledge Graph Compulsório)
- **REGRA OBRIGATÓRIA**: Antes de realizar buscas amplas (`Grep`/`Glob`), consulte o Grafo de Conhecimento com:
  `graphify query "<sua pergunta ou componente>"`
- Após modificações estruturais no código, execute:
  `graphify update .`

---

## 🛡️ Segurança & Zero-Trust
- Nunca versione chaves de API, credenciais Firebase Admin ou `.env`.
- Todas as mutações de API (`POST`, `PUT`, `DELETE`) requerem permissão de administrador.
- Conteúdos ricos gerados por usuários devem ser sanitizados contra XSS.
