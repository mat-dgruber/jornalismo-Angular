# MARK: - Imports & Dependencies
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .models import Post
from .serializers import PostSerializer, UserSerializer
from config.permissions import IsUnderUsageLimit

# MARK: - ViewSets
class PostViewSet(viewsets.ModelViewSet):
    """ViewSet para operações de CRUD em artigos e postagens do Blog.

    Permite visualização pública dos posts e exige autenticação Firebase
    para mutações de conteúdo (criação, edição e exclusão) e listagem de autores.
    """

    # MARK: - Configuration & Querysets
    queryset = Post.objects.select_related('author').all()
    serializer_class = PostSerializer
    lookup_field = 'slug'

    # MARK: - Permission Strategy
    def get_permissions(self):
        """Define dinamicamente a política de permissões por ação do ViewSet.

        Returns:
            list[permissions.BasePermission]: Lista de instâncias de classes de permissão
            aplicáveis para a requisição corrente.
        """
        # Mutações e listagem interna de usuários exigem autenticação do autor
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'users']:
            permission_classes = [permissions.IsAuthenticated, IsUnderUsageLimit]
        else:
            # Leituras (list, retrieve) são abertas publicamente para o portal
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    # MARK: - Custom Actions
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def users(self, request):
        """Retorna a listagem de autores cadastrados no sistema.

        Args:
            request (rest_framework.request.Request): Requisição HTTP contendo credenciais válidas.

        Returns:
            rest_framework.response.Response: Resposta JSON contendo IDs e nomes dos autores.
        """
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
