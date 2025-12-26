from django.db import models
from django.utils.text import slugify

class Artigo(models.Model):
    titulo = models.CharField(max_length=200, verbose_name="Título")
    subtitulo = models.CharField(max_length=200, verbose_name="Subtítulo", blank=True, null=True)
    conteudo = models.TextField(verbose_name="Conteúdo")
    data_publicacao = models.DateTimeField(verbose_name="Data de Publicação")
    local_publicacao = models.CharField(max_length=100, verbose_name="Local de Publicação")
    link_externo = models.URLField(verbose_name="Link Externo", blank=True, null=True)
    imagem = models.ImageField(upload_to="artigos/", verbose_name="Imagem", blank=True, null=True)
    slug = models.SlugField(unique=True, verbose_name="URL Amigável", blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

    def __str__(self):
        return self.titulo

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.titulo)
            original_slug = self.slug
            counter = 1
            while Artigo.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Artigo"
        verbose_name_plural = "Artigos"
        ordering = ["-data_publicacao"]
