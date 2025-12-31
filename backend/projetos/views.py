from rest_framework import viewsets, permissions
from .models import Projeto
from .serializers import ProjetoSerializer
from config.permissions import IsUnderUsageLimit

class ProjetoViewSet(viewsets.ModelViewSet):
    queryset = Projeto.objects.all()
    serializer_class = ProjetoSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsUnderUsageLimit]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]
