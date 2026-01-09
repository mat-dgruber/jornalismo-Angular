import os
import django

# Configure to use Neon DB for this script
os.environ['DATABASE_URL'] = 'postgresql://neondb_owner:npg_ALvOYRpE97Wk@ep-small-forest-acx78jyr-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from artigos.models import Artigo
from projetos.models import Projeto

print("--- VERIFICAÇÃO DO BANCO NEON ---")
print(f"Total de Artigos: {Artigo.objects.count()}")
for artigo in Artigo.objects.all()[:5]:
    print(f"- [Artigo] {artigo.titulo}")

print(f"\nTotal de Projetos: {Projeto.objects.count()}")
for projeto in Projeto.objects.all()[:5]:
    print(f"- [Projeto] {projeto.titulo}")
