from django.conf import settings
from django.db import connection
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from google.cloud import storage
import logging

logger = logging.getLogger(__name__)

# Limits
DB_LIMIT_BYTES = 1024 * 1024 * 1024  # 1 GB
STORAGE_LIMIT_BYTES = 5 * 1024 * 1024 * 1024  # 5 GB

def get_db_usage():
    """Returns the size of the current database in bytes."""
    with connection.cursor() as cursor:
        cursor.execute("SELECT pg_database_size(current_database());")
        row = cursor.fetchone()
        return row[0] if row else 0

def get_storage_usage():
    """
    Returns the estimated size of the Firebase Storage bucket in bytes.
    Cached for 1 hour to avoid excessive API calls.
    """
    cache_key = 'firebase_storage_usage_bytes'
    cached_usage = cache.get(cache_key)

    if cached_usage is not None:
        return cached_usage

    try:
        # Assuming authentication is handled via GOOGLE_APPLICATION_CREDENTIALS
        # or similar environment variables already set for django-storages.
        client = storage.Client()
        bucket_name = settings.GS_BUCKET_NAME
        
        if not bucket_name:
            logger.warning("GS_BUCKET_NAME not set. Returning 0 for storage usage.")
            return 0

        bucket = client.bucket(bucket_name)
        total_bytes = 0
        
        # List all blobs and sum their size
        # Note: This can be slow for buckets with many files. 
        # For a personal portfolio with < 5GB, it should be acceptable.
        blobs = bucket.list_blobs()
        for blob in blobs:
            total_bytes += blob.size

        # Cache the result for 1 hour (3600 seconds)
        cache.set(cache_key, total_bytes, 3600)
        return total_bytes

    except Exception as e:
        logger.error(f"Error calculating storage usage: {e}")
        return 0

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
