from django.db import models
from django.utils.text import slugify

class Projeto(models.Model):
    TIPO_CHOICES = [
        ('academico', 'Acadêmico'),
        ('pessoal', 'Pessoal'),
    ]

    titulo = models.CharField(max_length=200, verbose_name="Título")
    descricao = models.TextField(verbose_name="Descrição")
    data_realizacao = models.DateField(verbose_name="Data de Realização")
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, verbose_name="Tipo de Projeto")
    link_externo = models.URLField(verbose_name="Link do Projeto", blank=True, null=True)
    imagem = models.ImageField(upload_to="projetos/", verbose_name="Imagem", blank=True, null=True)
    slug = models.SlugField(max_length=255, unique=True, verbose_name="URL Amigável", blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

    def __str__(self):
        return self.titulo

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.titulo)
            original_slug = self.slug
            counter = 1
            while Projeto.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Projeto"
        verbose_name_plural = "Projetos"
        ordering = ["-data_realizacao"]
