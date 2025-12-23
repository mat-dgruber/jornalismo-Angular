from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
     title = models.CharField(max_length=200, verbose_name="Título")
     content = models.TextField()
     author = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Autor")
     published_date = models.DateTimeField(auto_now_add=True)
     subtitle = models.CharField(max_length=200, verbose_name="Subtítulo")
     slug = models.SlugField(unique=True, verbose_name="URL Amigável (ex: sobre-nos)")
     category = models.CharField(max_length=50, verbose_name="Categoria", default="Teologia")
     image = models.ImageField(upload_to="capas/", verbose_name="Imagem de Capa", blank=True, null=True)