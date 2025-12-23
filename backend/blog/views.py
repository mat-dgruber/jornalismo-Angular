from .serializers import PostSerializer 
from django.http import JsonResponse

# Modelos
from .models import Post

# Views
def home(request):
     posts = Post.objects.all()

     serializer = PostSerializer(posts, many=True)

     return JsonResponse(serializer.data, safe=False, context={'request':request})  

