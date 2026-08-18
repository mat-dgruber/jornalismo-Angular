# GEMINI.md — Diretrizes de Engenharia e Governança (jornalismo-Angular)

## 📌 Contexto da Aplicação
- **Nome**: Maria Izabela | Comunicação, Jornalismo & Teologia
- **Frontend**: Angular 19, TypeScript, Standalone Components, PrimeNG, Firebase Hosting.
- **Backend**: Python 3.12+, Django 5 REST Framework, Cloud Run.

---

## ⚡ Comandos Rápidos
- **Frontend**: `cd frontend && npm start` (Dev) | `cd frontend && npm run build` (Build SSG)
- **Backend**: `cd backend && python manage.py runserver` (Dev) | `cd backend && python manage.py test` (Testes)
- **Migrações**: `cd backend && python manage.py makemigrations && python manage.py migrate`

---

## 🎯 Regras de Operação para o Gemini CLI
1. **Documentação e Conversação**: Sempre em Português (**pt-BR**).
2. **Commits e Código**: Sempre em Inglês (**EN-US**) no padrão Conventional Commits.
3. **Graphify**: Sempre consultar o Grafo de Conhecimento antes de varreduras extensivas de arquivos.
4. **Segurança**: Respeitar o isolamento de rotas administrativas e políticas de CORS/Sanitização.
