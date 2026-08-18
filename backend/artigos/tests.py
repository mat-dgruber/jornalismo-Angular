# MARK: - Imports & Dependencies
from django.contrib.auth.models import User
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Artigo

# MARK: - Model Unit Tests
class TestArtigoModel(APITestCase):
    """Testes unitários para o modelo Artigo e geração automática de slugs."""

    def test_geracao_automatica_de_slug(self):
        """Valida se o slug é criado automaticamente a partir do título."""
        # Arrange & Act
        artigo = Artigo.objects.create(
            titulo="Jornalismo Investigativo no Brasil",
            conteudo="Análise aprofundada sobre as coberturas investigativas...",
            data_publicacao=timezone.now(),
            local_publicacao="Revista de Jornalismo"
        )

        # Assert
        self.assertEqual(artigo.slug, "jornalismo-investigativo-no-brasil")
        self.assertEqual(str(artigo), "Jornalismo Investigativo no Brasil")

    def test_desduplicacao_de_slugs_colidentes(self):
        """Garante que artigos com o mesmo título recebam sufixos numéricos incrementais."""
        # Arrange & Act
        artigo1 = Artigo.objects.create(
            titulo="Ética na Mídia",
            conteudo="Primeiro artigo...",
            data_publicacao=timezone.now(),
            local_publicacao="Blog Oficial"
        )
        artigo2 = Artigo.objects.create(
            titulo="Ética na Mídia",
            conteudo="Segundo artigo com mesmo título...",
            data_publicacao=timezone.now(),
            local_publicacao="Portal de Notícias"
        )

        # Assert
        self.assertEqual(artigo1.slug, "etica-na-midia")
        self.assertEqual(artigo2.slug, "etica-na-midia-1")

# MARK: - API Integration Tests
class TestArtigoAPI(APITestCase):
    """Testes de integração para os endpoints REST de Artigos."""

    def setUp(self):
        # Arrange
        self.user = User.objects.create_user(username="jornalista_admin", email="admin@exemplo.com")
        self.artigo = Artigo.objects.create(
            titulo="Reportagem Especial de Domingo",
            subtitulo="Bastidores da notícia",
            conteudo="Texto completo da reportagem...",
            data_publicacao=timezone.now(),
            local_publicacao="Jornal Diário",
            link_externo="https://exemplo.com/reportagem"
        )
        self.list_url = reverse('artigo-list')
        self.detail_url = reverse('artigo-detail', kwargs={'slug': self.artigo.slug})

    def test_listar_artigos_publico_retorna_200(self):
        """Garante que qualquer leitor consiga listar os artigos publicados."""
        # Act
        response = self.client.get(self.list_url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['slug'], self.artigo.slug)

    def test_obter_detalhe_artigo_por_slug_retorna_200(self):
        """Garante que a rota de detalhe retorne todos os campos do artigo."""
        # Act
        response = self.client.get(self.detail_url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['titulo'], "Reportagem Especial de Domingo")
        self.assertEqual(response.data['local_publicacao'], "Jornal Diário")

    def test_criar_artigo_sem_autenticacao_retorna_401_ou_403(self):
        """Garante que criação de artigos exija autenticação ativa."""
        # Arrange
        payload = {
            "titulo": "Novo Artigo Não Autorizado",
            "conteudo": "Tentativa de escrita pública.",
            "data_publicacao": timezone.now().isoformat(),
            "local_publicacao": "Site Fictício"
        }

        # Act
        response = self.client.post(self.list_url, payload)

        # Assert
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_criar_artigo_autenticado_retorna_201(self):
        """Garante que usuários autenticados consigam cadastrar novos artigos."""
        # Arrange
        self.client.force_authenticate(user=self.user)
        payload = {
            "titulo": "Novo Artigo Autorizado",
            "conteudo": "Artigo cadastrado com sucesso pela redação.",
            "data_publicacao": timezone.now().isoformat(),
            "local_publicacao": "Revista Acadêmica"
        }

        # Act
        response = self.client.post(self.list_url, payload)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['slug'], "novo-artigo-autorizado")
