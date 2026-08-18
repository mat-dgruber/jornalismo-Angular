# 📋 Guia de Execução de Testes — Backend (Django 5 REST Framework)

## 🚀 Comandos Essenciais

### 1. Execução via Django CLI (`manage.py`)

```bash
# Executar toda a suíte de testes do backend
cd backend && python manage.py test

# Executar com verbosidade detalhada
cd backend && python manage.py test -v 2

# Executar testes de um app específico
cd backend && python manage.py test blog
cd backend && python manage.py test artigos
cd backend && python manage.py test projetos
cd backend && python manage.py test materiais

# Executar classe ou método de teste específico
cd backend && python manage.py test blog.tests.PostAPITestCase.test_listar_posts
```

### 2. Medição de Cobertura de Código (`coverage`)

```bash
cd backend
coverage run --source='.' manage.py test
coverage report -m
coverage html # Gera relatório em htmlcov/index.html
```

---

## ⚙️ Variáveis de Ambiente para Testes

Os testes do Django utilizam por padrão um banco de dados SQLite isolado em memória ou temporário, não afetando o banco de desenvolvimento ou produção.
