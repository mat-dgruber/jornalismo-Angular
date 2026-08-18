# MARK: - Imports & Dependencies
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Post

# MARK: - Model Unit Tests
class TestPostModel(APITestCase):
    """Testes unitários para o modelo Post do blog."""

    def setUp(self):
        # Arrange: Criação do usuário autor
        self.user = User.objects.create_user(
            username="maria_izabela",
            email="maria@exemplo.com",
            first_name="Maria"
        )

    def test_criar_post_com_sucesso(self):
        """Valida a persistência correta de um post com autor associado."""
        # Act
        post = Post.objects.create(
            title="Comunicação e Sociedade",
            subtitle="O impacto das redes",
            slug="comunicacao-e-sociedade",
            content="Conteúdo completo sobre a teoria da comunicação...",
            category="Jornalismo",
            author=self.user
        )

        # Assert
        self.assertEqual(post.title, "Comunicação e Sociedade")
        self.assertEqual(post.author.username, "maria_izabela")
        self.assertEqual(post.category, "Jornalismo")
        self.assertIsNotNone(post.published_date)

# MARK: - API Integration Tests
class TestPostAPI(APITestCase):
    """Testes de integração para as rotas da API REST de Posts."""

    def setUp(self):
        # Arrange: Criação de autor e post inicial
        self.user = User.objects.create_user(
            username="autor_teste",
            email="autor@exemplo.com",
            first_name="Autor Teste"
        )
        self.post = Post.objects.create(
            title="Post de Exemplo",
            subtitle="Subtítulo de Exemplo",
            slug="post-de-exemplo",
            content="Conteúdo do post de exemplo para testes de API.",
            category="Teologia",
            author=self.user
        )
        self.list_url = reverse('post-list')
        self.detail_url = reverse('post-detail', kwargs={'slug': self.post.slug})
        self.users_url = reverse('post-users')

    def test_listar_posts_anonimo_retorna_200(self):
        """Garante que visitantes anônimos consigam listar os posts públicos."""
        # Act
        response = self.client.get(self.list_url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['slug'], "post-de-exemplo")

    def test_obter_detalhe_post_por_slug_retorna_200(self):
        """Garante que a busca de post por slug retorne os detalhes completos."""
        # Act
        response = self.client.get(self.detail_url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Post de Exemplo")
        self.assertEqual(response.data['author'], self.user.username)

    def test_criar_post_sem_autenticacao_retorna_401_ou_403(self):
        """Garante que requisições não autenticadas para criar posts sejam bloqueadas."""
        # Arrange
        payload = {
            "title": "Novo Post Não Autorizado",
            "subtitle": "Tentativa de injeção",
            "slug": "novo-post-nao-autorizado",
            "content": "Conteúdo teste",
            "category": "Jornalismo",
            "author": self.user.username
        }

        # Act
        response = self.client.post(self.list_url, payload)

        # Assert
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_criar_post_autenticado_retorna_201(self):
        """Garante que usuários autenticados consigam criar novos posts."""
        # Arrange
        self.client.force_authenticate(user=self.user)
        payload = {
            "title": "Novo Post Autorizado",
            "subtitle": "Criado com sucesso",
            "slug": "novo-post-autorizado",
            "content": "Conteúdo criado por usuário logado.",
            "category": "Jornalismo",
            "author": self.user.username
        }

        # Act
        response = self.client.post(self.list_url, payload)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['slug'], "novo-post-autorizado")

    def test_endpoint_users_exige_autenticacao(self):
        """Garante que a listagem de autores (/api/posts/users/) exija autenticação."""
        # Act 1: Requisição anônima
        anon_response = self.client.get(self.users_url)
        # Assert 1: Acesso negado
        self.assertIn(anon_response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        # Act 2: Requisição autenticada
        self.client.force_authenticate(user=self.user)
        auth_response = self.client.get(self.users_url)
        # Assert 2: Sucesso
        self.assertEqual(auth_response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(auth_response.data), 1)
