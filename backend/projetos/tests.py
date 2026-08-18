# MARK: - Imports & Dependencies
from django.contrib.auth.models import User
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Projeto

# MARK: - Model Unit Tests
class TestProjetoModel(APITestCase):
    """Testes unitários para o modelo Projeto."""

    def test_geracao_automatica_de_slug_projeto(self):
        """Valida a geração automática do slug a partir do título do projeto."""
        # Arrange & Act
        projeto = Projeto.objects.create(
            titulo="Documentário Histórico do Centro",
            descricao="Projeto audiovisual sobre memória urbana.",
            data_realizacao=timezone.now().date(),
            tipo="academico"
        )

        # Assert
        self.assertEqual(projeto.slug, "documentario-historico-do-centro")
        self.assertEqual(str(projeto), "Documentário Histórico do Centro")
        self.assertEqual(projeto.tipo, "academico")

    def test_desduplicacao_de_slugs_projetos(self):
        """Valida que projetos com o mesmo título gerem slugs incrementais."""
        # Arrange & Act
        proj1 = Projeto.objects.create(
            titulo="Cobertura Eleitoral",
            descricao="Primeira cobertura",
            data_realizacao=timezone.now().date(),
            tipo="pessoal"
        )
        proj2 = Projeto.objects.create(
            titulo="Cobertura Eleitoral",
            descricao="Segunda cobertura",
            data_realizacao=timezone.now().date(),
            tipo="pessoal"
        )

        # Assert
        self.assertEqual(proj1.slug, "cobertura-eleitoral")
        self.assertEqual(proj2.slug, "cobertura-eleitoral-1")

# MARK: - API Integration Tests
class TestProjetoAPI(APITestCase):
    """Testes de integração para os endpoints REST de Projetos."""

    def setUp(self):
        # Arrange
        self.user = User.objects.create_user(username="produtor_admin", email="produtor@exemplo.com")
        self.projeto = Projeto.objects.create(
            titulo="Podcast de Entrevistas Culturais",
            subtitulo="Vozes e narrativas contemporâneas",
            descricao="Série de episódios gravados em áudio.",
            conteudo="Detalhes de produção do podcast...",
            data_realizacao=timezone.now().date(),
            tipo="academico"
        )
        self.list_url = reverse('projeto-list')
        self.detail_url = reverse('projeto-detail', kwargs={'slug': self.projeto.slug})

    def test_listar_projetos_publico_retorna_200(self):
        """Garante que visitantes anônimos possam listar projetos do portfólio."""
        # Act
        response = self.client.get(self.list_url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['slug'], self.projeto.slug)

    def test_obter_detalhe_projeto_por_slug_retorna_200(self):
        """Garante retorno de detalhes completos do projeto por slug."""
        # Act
        response = self.client.get(self.detail_url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['titulo'], "Podcast de Entrevistas Culturais")
        self.assertEqual(response.data['tipo'], "academico")

    def test_criar_projeto_sem_autenticacao_retorna_401_ou_403(self):
        """Garante bloqueio de escrita anônima em projetos."""
        # Arrange
        payload = {
            "titulo": "Projeto Não Autorizado",
            "descricao": "Tentativa de injeção",
            "data_realizacao": timezone.now().date().isoformat(),
            "tipo": "pessoal"
        }

        # Act
        response = self.client.post(self.list_url, payload)

        # Assert
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_criar_projeto_autenticado_retorna_201(self):
        """Garante criação de projeto por usuário autenticado."""
        # Arrange
        self.client.force_authenticate(user=self.user)
        payload = {
            "titulo": "Novo Portal de Notícias Regional",
            "descricao": "Desenvolvimento e cobertura jornalística.",
            "data_realizacao": timezone.now().date().isoformat(),
            "tipo": "pessoal"
        }

        # Act
        response = self.client.post(self.list_url, payload)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['slug'], "novo-portal-de-noticias-regional")
