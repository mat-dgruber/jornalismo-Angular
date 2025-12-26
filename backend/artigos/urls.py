from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArtigoViewSet

router = DefaultRouter()
router.register(r'', ArtigoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
