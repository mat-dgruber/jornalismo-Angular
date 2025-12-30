from django.contrib import admin
from .models import Projeto

@admin.register(Projeto)
class ProjetoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'tipo', 'data_realizacao')
    search_fields = ('titulo', 'descricao')
    list_filter = ('tipo',)
    prepopulated_fields = {'slug': ('titulo',)}
