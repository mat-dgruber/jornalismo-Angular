# 🎯 Arquitetura e Plano de Padronização de Testes — Backend (Django 5 REST Framework)

## 📊 Visão Geral da Arquitetura de Testes

O backend do projeto **jornalismo-Angular** é estruturado em apps modulares do Django (`artigos`, `blog`, `materiais`, `projetos`, `config`). A suíte de testes é organizada para garantir integridade dos dados editoriais, segurança nas mutações e alta velocidade de resposta dos endpoints públicos.

---

## 🏗️ Pirâmide e Camadas de Teste

```
        / \
       /   \     10% E2E / Permissões (Testes de Fluxo Administrativo Completo)
      / E2E \
     /-------\   30% Testes de API REST (APITestCase / DRF Views & Rotas)
    / Integra \
   /-----------\ 60% Testes de Models, Serializers e Utilitários
  /  Unitários  \
 /---------------\
```

### **1. Testes Unitários de Models e Serializers (~60%)**
- **Escopo**: Validação de campos em `models.py`, `serializers.py` e validações de slug único.
- **Isolamento**: Testes rápidos com banco de dados de teste do Django.

### **2. Testes de Endpoints REST (~30%)**
- **Escopo**: `APITestCase` para verificar status codes, contratos JSON, paginação e ordenação por data de publicação.

### **3. Testes de Permissão e Segurança (~10%)**
- **Escopo**: Garantir que mutações de conteúdo exijam tokens de administrador e que rotas de leitura sejam públicas.

---

## 🚀 Plano de Execução

1. **App `blog`**: Testes de listagem de posts públicos, detalhe por slug, e bloqueio de criação anônima.
2. **App `artigos`**: Testes de cadastro de matérias externas, validação de link e local de publicação.
3. **App `projetos`**: Testes de filtragem por tipo (acadêmico vs. pessoal) e integridade de slug.
4. **App `materiais`**: Testes de download de e-books e categorização de recursos.
