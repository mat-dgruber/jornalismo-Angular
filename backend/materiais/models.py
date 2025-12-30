from django.db import models
from django.utils.text import slugify

# Create your models here.
class Material(models.Model):
    name = models.CharField(max_length=50, verbose_name="Nome")
    description = models.TextField(verbose_name="Descrição")
    file = models.FileField(upload_to="materiais", verbose_name="Arquivo", blank=True, null=True)
    image = models.ImageField(upload_to="materiais", verbose_name="Imagem")
    category = models.CharField(max_length=50, verbose_name="Categoria")
    slug = models.SlugField(unique=True, verbose_name="URL Amigável (ex: sobre-nos)", blank=True)
    type = models.CharField(max_length=50, verbose_name="Tipo (pago ou gratuito)", choices=[('gratuito', 'Gratuito'), ('pago', 'Pago')], default='gratuito')
    external_link = models.URLField(verbose_name="Link Externo (Para materiais pagos)", blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Preço", blank=True, null=True)
    published_date = models.DateTimeField(auto_now_add=True, verbose_name="Data de Publicação")
    updated_date = models.DateTimeField(auto_now=True, verbose_name="Data de Atualização")
    
    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            original_slug = self.slug
            counter = 1
            while Material.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse("material_detail", kwargs={"slug": self.slug})

    class Meta:
        verbose_name = "Material"
        verbose_name_plural = "Materiais"
        ordering = ["-published_date"]