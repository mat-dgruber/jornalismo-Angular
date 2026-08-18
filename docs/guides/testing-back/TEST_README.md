# 🎯 Índice Completo: Guia e Padrões de Testes do Backend (Django REST)

## 📋 Documentação Interconectada

Este é o **índice principal** que norteia a arquitetura, execução, escrita e manutenção de testes para o backend do projeto **jornalismo-Angular**. A estrutura segue o padrão **Django 5 + Django REST Framework**, com `APITestCase`, `APIClient`, serializers, models e permissions.

---

### **🚀 Estrutura dos Guias de Teste**

#### **1. Plano e Arquitetura de Testes**
📄 **[test-modernization-plan.md](./test-modernization-plan.md)**
- **Propósito**: Diretrizes arquiteturais para estruturação da pirâmide de testes nos apps do Django (`artigos`, `blog`, `materiais`, `projetos`, `config`).
- **Conteúdo**: Pirâmide de testes (Unitários de Model/Serializer, Integração de API Endpoints, Segurança/Permissions).

#### **2. Padrões de Escrita**
📄 **[test-writing-standards.md](./test-writing-standards.md)**
- **Propósito**: Convenções e regras obrigatórias para escrita de testes em Django REST.
- **Conteúdo**: Padrão AAA (*Arrange, Act, Assert*), uso de `rest_framework.test.APITestCase`, fixtures de dados e validação de status HTTP.

#### **3. Guia de Execução**
📄 **[test-execution-guide.md](./test-execution-guide.md)**
- **Propósito**: Comandos para execução de testes via Django test runner e pytest.
- **Conteúdo**: `python manage.py test`, testes por app (`artigos`, `blog`, etc.), medição de cobertura com `coverage`.

#### **4. Troubleshooting e Resolução de Problemas**
📄 **[troubleshooting.md](./troubleshooting.md)**
- **Propósito**: Diagnóstico de falhas comuns em testes do Django (banco de dados de teste, migrações, permissões e autenticação).

---

## 🚀 Comandos Essenciais

```bash
# Executar todos os testes do backend
cd backend && python manage.py test

# Executar testes de um app específico
cd backend && python manage.py test blog
cd backend && python manage.py test artigos

# Executar com relatório de cobertura
cd backend && coverage run --source='.' manage.py test && coverage report
```
