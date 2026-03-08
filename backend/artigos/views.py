from rest_framework import viewsets, permissions
from .models import Artigo
from .serializers import ArtigoSerializer
from config.permissions import IsUnderUsageLimit

class ArtigoViewSet(viewsets.ModelViewSet):
    queryset = Artigo.objects.all()
    serializer_class = ArtigoSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsUnderUsageLimit]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]
