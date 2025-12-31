from django.conf import settings
from django.db import connection
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# ...

class UsageStatsView(APIView):
    """
    API endpoint to retrieve current database and storage usage.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        db_usage = get_db_usage()
        storage_usage = get_storage_usage()

        return Response({
            "database": {
                "used_bytes": db_usage,
                "limit_bytes": DB_LIMIT_BYTES,
                "percentage": min((db_usage / DB_LIMIT_BYTES) * 100, 100)
            },
            "storage": {
                "used_bytes": storage_usage,
                "limit_bytes": STORAGE_LIMIT_BYTES,
                "percentage": min((storage_usage / STORAGE_LIMIT_BYTES) * 100, 100)
            }
        })
