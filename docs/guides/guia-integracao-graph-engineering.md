# 🌐 Guia de Integração de Graph Engineering para jornalismo-Angular

## 🎯 Diagnóstico do Repositório

O repositório **jornalismo-Angular** possui uma infraestrutura completa de agentes de IA com dual-harness: **Claude Code / OpenClaude** (`CLAUDE.md`, `.claude/`) e **Gemini CLI** (`GEMINI.md`, `.agent/`). O projeto é composto por:
- **Frontend**: Angular 19 Standalone, PrimeNG, Signals, Prerender SSG.
- **Backend**: Django 5 + Django REST Framework (`artigos`, `blog`, `materiais`, `projetos`, `config`).

Este guia habilita e documenta o **Knowledge Graph (Grafo de Conhecimento)** operacional e consultável que os agentes de IA utilizam para navegar pela base de código com precisão e até 70% de economia de tokens.

---

## 🛠️ Instalação e Comandos do Graphify

### 1. Instalação da CLI

```bash
# Instalar a ferramenta Graphify via uv ou pip
uv tool install graphifyy   # ou: pip install graphifyy
```

### 2. Geração e Atualização do Grafo

```bash
# Gerar o grafo a partir da raiz do monorepo
graphify extract . --force --code-only

# Atualização incremental após alterações de código
graphify update .
```

Isso gera e mantém os artefatos na pasta `graphify-out/`:
- `graph.json`: O grafo de conhecimento estruturado com nós e arestas.
- `graph.html`: Visualizador interativo de nós e comunidades de código.
- `GRAPH_REPORT.md`: Relatório textual de hubs centrais, dependências e comunidades.

---

## 🔍 Consulta do Grafo pelos Agentes

Antes de efetuar leituras massivas com `Grep` ou `Glob`, os agentes consultam o grafo:

```bash
# Consultar entidades e fluxos relacionados a um módulo
graphify query "como funciona a autenticação administrativa no backend Django?"

# Explicar relacionamentos de um componente ou serializer
graphify query "quais componentes do Angular consomem a API de artigos?"
```
