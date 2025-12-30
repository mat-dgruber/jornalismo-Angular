from rest_framework import serializers
from .models import Post
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name']

class PostSerializer(serializers.ModelSerializer):
     # Isso diz ao Django: "Aceite o texto do username e ache o ID do usuário pra mim"
     author = serializers.SlugRelatedField(
          slug_field='username', 
          queryset=User.objects.all()
     )
     author_first_name = serializers.ReadOnlyField(source='author.first_name')
     author_last_name = serializers.ReadOnlyField(source='author.last_name')
     
     class Meta:
          model = Post
          
          fields = ['id', 'title', 'content', 'author', 'author_first_name', 'author_last_name', 'published_date', 'subtitle', 'category', 'image', 'slug']