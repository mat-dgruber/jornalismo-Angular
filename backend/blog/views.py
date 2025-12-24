from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Post
from django.contrib.auth.models import User
from .serializers import PostSerializer, UserSerializer

# Views
@api_view(['GET'])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def home(request):
     posts = Post.objects.all()
     serializer = PostSerializer(posts, many=True)
     return Response(serializer.data)

@api_view(['GET'])
def post_detail(request, slug):
     post = get_object_or_404(Post, slug=slug)
     serializer = PostSerializer(post)
     return Response(serializer.data)

@api_view(['POST'])
def create_post(request):
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

