# 📐 Padrões de Escrita de Testes — Backend (Django 5 REST Framework)

## 🎯 Estrutura Obrigatória (AAA Pattern)

Todo teste deve ser organizado de forma clara e explícita utilizando o padrão **Arrange, Act, Assert**:

```python
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from blog.models import Post

class TestPostAPI(APITestCase):
    def setUp(self):
        # Arrange — Criação de entidades e estado inicial
        self.post = Post.objects.create(
            title="A Importância da Ética no Jornalismo",
            slug="a-importancia-da-etica-no-jornalismo",
            subtitle="Reflexões sobre comunicação na era digital",
            content="Texto completo do artigo...",
            is_published=True
        )
        self.url = reverse('post-list')

    def test_listar_posts_publicados_retorna_200(self):
        # Act — Execução da requisição HTTP
        response = self.client.get(self.url)

        # Assert — Verificação de status e payload
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "A Importância da Ética no Jornalismo")
```

---

## 📝 Convenções de Nomenclatura

### **1. Classes de Teste**
- Deve utilizar PascalCase com o sufixo ou prefixo `Test` ou `APITestCase`.
- Nome alinhado ao app e model testado: `TestPostModel`, `TestPostSerializer`, `TestPostAPI`, `TestArtigoAPI`.

### **2. Métodos de Teste**
- Deve utilizar snake_case com o prefixo `test_`.
- Formato: `test_<acao>_<cenario>_<resultado_esperado>`
  - `test_listar_artigos_publicos_retorna_sucesso`
  - `test_criar_artigo_sem_token_retorna_401`
  - `test_buscar_projeto_por_slug_inexistente_retorna_404`

---

## 🎭 Estratégias de Testes nos Apps de Domínio

### **1. Testes de Model e Serializer (Unitários)**
- Valida campos obrigatórios, geração automática de slugs, métodos `__str__` e validações customizadas do DRF.

### **2. Testes de Endpoints da API (Integração)**
- Utiliza `self.client` nativo do `APITestCase`.
- Valida serialização, paginação, filtros de categoria/status e headers HTTP.

### **3. Testes de Permissões e Segurança**
- Garante que rotas de escrita (`POST`, `PUT`, `DELETE`) em `/api/` e `/admin/` bloqueiem usuários não autenticados ou sem privilégios de `is_staff`.
