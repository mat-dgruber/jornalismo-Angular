# MARK: - Imports & Dependencies
import io
from PIL import Image
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Material

# MARK: - Helpers
def get_test_image():
    """Gera um arquivo de imagem JPEG válido via Pillow para testes de upload no Django."""
    file = io.BytesIO()
    image = Image.new('RGB', (50, 50), color='blue')
    image.save(file, format='JPEG')
    file.seek(0)
    return SimpleUploadedFile(
        name='capa_teste.jpg',
        content=file.read(),
        content_type='image/jpeg'
    )

# MARK: - Model Unit Tests
class TestMaterialModel(APITestCase):
    """Testes unitários para o modelo Material acadêmico/profissional."""

    def test_geracao_automatica_de_slug(self):
        """Valida a criação do slug automático a partir do nome do material."""
        # Arrange & Act
        material = Material.objects.create(
            name="E-book de Redação Jornalística",
            description="Guia prático para estudantes de jornalismo.",
            category="E-books",
            type="gratuito"
        )

        # Assert
        self.assertEqual(material.slug, "e-book-de-redacao-jornalistica")
        self.assertEqual(str(material), "E-book de Redação Jornalística")
        self.assertEqual(material.get_absolute_url(), f"/api/materiais/{material.slug}/")

    def test_desduplicacao_de_slugs_materiais(self):
        """Valida que materiais com nomes idênticos gerem slugs incrementais."""
        # Arrange & Act
        mat1 = Material.objects.create(
            name="Guia de Pauta",
            description="Primeira versão",
            category="Guias",
            type="gratuito"
        )
        mat2 = Material.objects.create(
            name="Guia de Pauta",
            description="Segunda versão",
            category="Guias",
            type="gratuito"
        )

        # Assert
        self.assertEqual(mat1.slug, "guia-de-pauta")
        self.assertEqual(mat2.slug, "guia-de-pauta-1")

# MARK: - API Integration Tests
class TestMaterialAPI(APITestCase):
    """Testes de integração para a API REST de Materiais."""

    def setUp(self):
        # Arrange
        self.user = User.objects.create_user(username="prof_admin", email="prof@exemplo.com")
        self.material = Material.objects.create(
            name="Template de Reportagem",
            description="Modelo estruturado de texto jornalístico.",
            category="Templates",
            type="gratuito"
        )
        self.list_url = reverse('material-list')
        self.detail_url = reverse('material-detail', kwargs={'slug': self.material.slug})

    def test_listar_materiais_publico_retorna_200(self):
        """Garante que qualquer visitante consiga listar materiais disponíveis."""
        # Act
        response = self.client.get(self.list_url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['slug'], self.material.slug)

    def test_obter_detalhe_material_por_slug_retorna_200(self):
        """Garante que a rota de detalhe retorne as informações do material."""
        # Act
        response = self.client.get(self.detail_url)

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Template de Reportagem")

    def test_criar_material_sem_autenticacao_retorna_401_ou_403(self):
        """Garante bloqueio de escrita anônima em materiais."""
        # Arrange
        payload = {
            "name": "Material Não Autorizado",
            "description": "Tentativa de injeção",
            "category": "E-books",
            "type": "gratuito",
            "image": get_test_image()
        }

        # Act
        response = self.client.post(self.list_url, payload, format='multipart')

        # Assert
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_criar_material_autenticado_retorna_201(self):
        """Garante cadastro com sucesso de material por usuário autenticado."""
        # Arrange
        self.client.force_authenticate(user=self.user)
        payload = {
            "name": "Novo Manual de Estilo",
            "description": "Manual oficial de redação.",
            "category": "Manuais",
            "type": "gratuito",
            "image": get_test_image()
        }

        # Act
        response = self.client.post(self.list_url, payload, format='multipart')

        # Assert
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['slug'], "novo-manual-de-estilo")
