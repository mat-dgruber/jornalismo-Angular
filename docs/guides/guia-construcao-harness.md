# 🚀 Guia Prático de Construção e Operação de Harness de Alta Maturidade para Agentes de IA (jornalismo-Angular)

**Data**: 18 de Agosto de 2026  
**Versão**: 2.0.0  
**Status**: Aprovado / Guia Operacional  
**Escopo**: Dual-Harness (OpenClaude / Claude Code & Gemini CLI)  
**Projeto**: Maria Izabela | Portal Editorial, Blog & Portfólio (jornalismo-Angular)  
**Autor**: Equipe de Engenharia de IA & Arquitetura de Sistemas  

---

## ⚙️ Seção 0: Pré-Requisitos e Setup Inicial

> 💡 **Leia antes de começar.** Esta seção deve ser executada uma única vez em cada máquina de desenvolvimento. Ela garante que todas as ferramentas do Harness estejam instaladas e configuradas antes de qualquer interação com agentes de IA.

---

### 0.1 Ferramentas Obrigatórias

| Ferramenta | Propósito no Harness | Instalação |
| :--- | :--- | :--- |
| `node` (v20+) & `npm` | Runtime e gerenciador de pacotes do Frontend Angular 19 | `brew install node` / `nvm use 20` |
| `@angular/cli` (v19+) | CLI do Angular para build, serve, testes e SSG | `npm install -g @angular/cli` |
| `python` (3.12+) | Runtime do Backend Django 5 REST Framework | `brew install python@3.12` |
| `uv` ou `venv` | Gerenciador de pacotes Python e ambiente virtual | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| `ruff` | Linter e formatter Python (zero-turn via hooks) | `pip install ruff` ou `uv tool install ruff` |
| `graphify` | Navegação por Knowledge Graph (compulsória) | `pip install graphify-cli` ou `uv tool install graphify-cli` |
| `firebase-tools` | CLI do Firebase Hosting, Rules e Deploy | `npm install -g firebase-tools` |
| `jq` | Parsing de JSON nos hooks de ciclo de vida | `brew install jq` (macOS) / `apt install jq` (Linux) |
| `ai-jail` *(opcional)* | Sandbox de segurança para isolar os agentes | Ver seção 0.4 |
| OpenClaude / Claude Code CLI | Agente de IA principal (harness Claude) | `npm install -g @anthropic-ai/claude-code` |
| Gemini CLI | Agente de IA auxiliar (harness Gemini) | `npm install -g @google/gemini-cli` |

---

### 0.2 Variáveis de Ambiente

O ecossistema da aplicação e dos agentes requer variáveis de ambiente para o Backend Django e o Frontend Angular:

```bash
# 1. Configuração do Backend Django
cd backend
cp .env.example .env # se disponível, ou configurar SECRET_KEY, DEBUG, DATABASE_URL

# 2. Configuração do Frontend Angular
cd ../frontend
# Variáveis de Firebase e API configuradas em src/environments/
```

**Variáveis críticas:**

| Variável | Uso |
| :--- | :--- |
| `SECRET_KEY` | Chave criptográfica do Django |
| `DEBUG` | Modo de depuração do Django (False em produção) |
| `ALLOWED_HOSTS` | Hosts permitidos na API Django (`mariaizabela.com.br`, `localhost`) |
| `DATABASE_URL` | Conexão PostgreSQL (Produção) / SQLite (Dev local) |
| `FIREBASE_API_KEY` | Autenticação administrativa no Frontend |

---

### 0.3 Quick Start: Setup do Harness em 8 Passos

```bash
# 1. Instalar dependências do Frontend (Angular 19)
cd frontend && npm install

# 2. Configurar e instalar dependências do Backend (Django 5)
cd ../backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt # ou uv pip install -r requirements.txt
python manage.py migrate

# 3. Testar compilação do Frontend com Prerender
cd ../frontend && npm run build

# 4. Executar testes do Backend
cd ../backend && python manage.py test

# 5. Gerar o Knowledge Graph inicial (OBRIGATÓRIO antes de usar agentes)
cd ..
graphify extract . --force --code-only
# O grafo base será gerado em graphify-out/graph.json

# 6. Sincronizar memória global do agente para o repositório local
./.claude/sync-claude-memory.sh pull

# 7. Testar conexão do Agente e MCPs no Sandbox (opcional)
ai-jail openclaude

# 8. Realizar o commit inicial de setup
git add .
git commit -m "chore(harness): setup inicial do dual-harness, graphify e guias"
```

---

## 📖 Introdução e Arquitetura do Monorepo

O projeto **jornalismo-Angular** é uma plataforma editorial e portfólio profissional para **Maria Izabela**, combinando publicação jornalística, matérias em veículos de imprensa, projetos acadêmicos e e-books/materiais educativos.

```
jornalismo-Angular/                     # Raiz do Monorepo
├── .agents/                             # Camada compartilhada de regras e skills dos agentes
│   └── rules/                           # Regras globais (core-skills.md)
├── .claude/                             # Configurações do Claude Code / OpenClaude
│   ├── memory/                          # Memórias de equipe versionadas
│   ├── settings.json                    # Hooks PreToolUse/PostToolUse
│   └── sync-claude-memory.sh            # Script de sincronização de memória
├── .gemini/                             # Configurações do Gemini CLI
│   ├── memory/                          # Memórias espelhadas do Gemini
│   └── settings.json                    # Hooks BeforeTool/AfterTool e MCPs
├── backend/                             # API REST em Django 5 + Django REST Framework
│   ├── artigos/                         # App de matérias e reportagens externas
│   ├── blog/                            # App de ensaios e posts do blog
│   ├── materiais/                       # App de e-books e recursos educativos
│   ├── projetos/                        # App de projetos acadêmicos e iniciativas
│   ├── config/                          # Configurações globais, rotas e auth
│   └── manage.py                        # CLI do Django
├── frontend/                            # Aplicação Web Angular 19 (SSG / SSR / PrimeNG)
│   ├── src/                             # Código fonte TypeScript, HTML e CSS
│   ├── public/                          # Assets públicos, robots.txt, sitemap.xml, llms.txt
│   ├── scripts/                         # Scripts de automação SEO e auditoria
│   ├── angular.json                     # Configuração do Angular CLI e build
│   └── package.json                     # Dependências do Frontend
├── docs/                                # Documentação técnica e relatórios
│   ├── guides/                          # Guias de desenvolvimento, testes e harness
│   └── reports/                         # Relatórios executivos de auditoria
├── firebase.json                        # Configuração de hosting, headers e rewrites
├── CLAUDE.md                            # Diretrizes globais para o Claude Code
├── GEMINI.md                            # Diretrizes globais para o Gemini CLI
├── .graphifyignore                      # Regras de exclusão do Knowledge Graph
└── .ai-jail                             # Configuração do sandbox de segurança
```

---

## 🏛️ Os 7 Pilares do Harness no jornalismo-Angular

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          OS 7 PILARES DO HARNESS DE NÍVEL 3                            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  [Pilar 1] Instruções Paritárias ──► CLAUDE.md e GEMINI.md com convenções vivas       │
│  [Pilar 2] Formatação Zero-Turn ───► Hooks Pre/Post Tool Use (Ruff format & Prettier)  │
│  [Pilar 3] Partida Compulsória  ───► Diretriz "Graphify Before Grep/Glob"              │
│  [Pilar 4] Taxonomia de Skills  ───► Superpowers + SEO/AEO + Skills de Domínio         │
│  [Pilar 5] Subagentes Isolados  ───► Auditoria dedicada (verification, seo-reviewer)  │
│  [Pilar 6] Memória & Git Hooks  ───► Auto-staging de memórias via pre-commit           │
│  [Pilar 7] Testes Determinísticos ─► Django APITestCase (Backend) + Karma (Frontend)   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.1 Pilar 1: Instruções e Convenções Paritárias (`CLAUDE.md` / `GEMINI.md`)
- Centraliza os comandos operacionais (`npm run build`, `python manage.py test`, `python manage.py migrate`).
- Estabelece a política de idiomas: **Documentação e explicações em pt-BR**, código e commits em **EN-US** no padrão **Conventional Commits**.

### 1.2 Pilar 2: Automações e Formatação Zero-Turn
- O hook `PostToolUse` roda silenciosamente `ruff check --fix` e `ruff format` em arquivos `.py`, e formatação em arquivos `.ts`/`.html`/`.css`, eliminando turnos gastos com alinhamento de código.

### 1.3 Pilar 3: Partida Compulsória (Graphify & Knowledge Graph)
- O agente consulta o grafo `graphify-out/graph.json` via `graphify query` antes de realizar buscas cegas com `Grep`/`Glob`, economizando tokens e preservando o contexto arquitetural.

### 1.4 Pilar 4: Taxonomia de Skills
- Combina governança (`superpowers:*`), design e usabilidade (`design-review`, `frontend-design`), auditoria de busca (`seo-aeo-geo`), e automações locais.

### 1.5 Pilar 5: Subagentes com Contexto Isolado
- Disparo de subagentes com janela de contexto limpa (`verification`, `code-reviewer`) para auditorias antes da entrega final de tarefas complexas.

### 1.6 Pilar 6: Memória Persistente & Sincronização
- Memória privada em `.openclaude/.../memory/` e memória de equipe em `.claude/memory/team/` e `.gemini/memory/team/`, protegidas por auto-staging no pre-commit hook.

### 1.7 Pilar 7: Infraestrutura de Testes Determinística
- **Frontend**: Testes de componentes, pipes e serviços via Karma/Jasmine (`ng test --watch=false`).
- **Backend**: Testes de rotas REST, serializers e modelos via Django Test Runner (`python manage.py test`).

---

## 📜 Blueprints Operacionais para o Projeto

### Blueprint 1: `CLAUDE.md` (Raiz do Repositório)

```markdown
# CLAUDE.md — Diretrizes de Engenharia (jornalismo-Angular)

## Commands Reference
- **Frontend Build**: `cd frontend && npm run build`
- **Frontend Dev**: `cd frontend && npm start`
- **Frontend Tests**: `cd frontend && npm test -- --watch=false`
- **Backend Run**: `cd backend && python manage.py runserver`
- **Backend Tests**: `cd backend && python manage.py test`
- **Backend Migrations**: `cd backend && python manage.py makemigrations && python manage.py migrate`
- **Memory Sync**: `./.claude/sync-claude-memory.sh pull` / `./.claude/sync-claude-memory.sh push`

## Architecture
- **Frontend**: Angular 19 Standalone Components, Signal-based reactivity, PrimeNG UI, SEO Prerender SSG.
- **Backend**: Django 5 + Django REST Framework (Apps: `artigos`, `blog`, `materiais`, `projetos`, `config`).
- **Hosting**: Firebase Hosting (Frontend) + Google Cloud Run (Backend API).

## Language & Commits
- **Documentation & Chat**: Português (pt-BR)
- **Code & Commits**: English (EN-US), Conventional Commits format (`feat:`, `fix:`, `chore:`, `docs:`).

## graphify (Knowledge Graph)
- **MANDATORY**: Run `graphify query "<pergunta>"` before broad `Grep`/`Glob` searches.
- After code edits: `graphify update .`
```

### Blueprint 2: `GEMINI.md` (Raiz do Repositório)

```markdown
# GEMINI.md — Diretrizes do Projeto jornalismo-Angular

## 1. Stack Técnica
- **Frontend**: Angular 19, TypeScript, Standalone Components, PrimeNG, Firebase Hosting.
- **Backend**: Python 3.12+, Django 5, Django REST Framework, Cloud Run.

## 2. Comandos de Desenvolvimento
- Frontend: `cd frontend && npm start` | Build: `cd frontend && npm run build`
- Backend: `cd backend && python manage.py runserver` | Testes: `cd backend && python manage.py test`

## 3. Diretrizes de Governança
- Toda documentação técnica em **pt-BR**.
- Commits obrigatórios em **EN-US** no padrão Conventional Commits.
- Sempre consultar o Knowledge Graph (`graphify query`) antes de varreduras extensivas.
```

---

## 🛠️ Checklist de Certificação de Harness Nível 3

- [x] Arquivo `CLAUDE.md` presente e atualizado na raiz.
- [x] Arquivo `GEMINI.md` presente e paritário na raiz.
- [x] Estrutura `.claude/` e `.gemini/` com scripts de sincronização de memória.
- [x] Configuração `.graphifyignore` cobrindo artefatos de build (`dist/`, `node_modules/`, `__pycache__/`).
- [x] Configuração `.ai-jail` para isolamento de sandbox.
- [x] Testes de Frontend (`ng test`) e Backend (`python manage.py test`) documentados e funcionais.
