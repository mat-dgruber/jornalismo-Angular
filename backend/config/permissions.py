from rest_framework import permissions
from .usage_stats import get_db_usage, get_storage_usage, DB_LIMIT_BYTES, STORAGE_LIMIT_BYTES

class IsUnderUsageLimit(permissions.BasePermission):
    """
    Custom permission to only allow writes if usage is under limits.
    """

    def has_permission(self, request, view):
        # Allow safe methods (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True

        # Check limits for unsafe methods (POST, PUT, PATCH, DELETE)
        # Note: DELETE might free up space, so strictly speaking we should allow it.
        # But 'unsafe methods' usually covers modification.
        # Let's allow DELETE to clear space.
        if request.method == 'DELETE':
            return True

        # Check DB Limit
        db_usage = get_db_usage()
        if db_usage >= DB_LIMIT_BYTES:
            self.message = "Database limit exceeded (1GB). Please delete some data to continue."
            return False

        # Check Storage Limit
        storage_usage = get_storage_usage()
        if storage_usage >= STORAGE_LIMIT_BYTES:
            self.message = "Storage limit exceeded (5GB). Please delete some files to continue."
            return False

        return True
