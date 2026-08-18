# MARK: - Imports & Dependencies
from rest_framework import permissions
from .usage_stats import get_db_usage, get_storage_usage, DB_LIMIT_BYTES, STORAGE_LIMIT_BYTES

# MARK: - Custom Permission Classes
class IsUnderUsageLimit(permissions.BasePermission):
    """Permissão do Django REST Framework para proteção contra exaustão de armazenamento e DoS.

    Bloqueia mutações de dados (POST, PUT, PATCH) caso os limites de armazenamento
    do banco de dados ou de arquivos estáticos/mídia sejam ultrapassados.
    """

    message = "Limite de armazenamento da cota atingido. Novas escritas estão temporariamente bloqueadas."

    def has_permission(self, request, view):
        """Verifica se a requisição possui permissão com base nos limites atuais de infraestrutura.

        Args:
            request (rest_framework.request.Request): Objeto da requisição HTTP do Django.
            view (rest_framework.viewsets.ViewSet): Viewset de destino da requisição.

        Returns:
            bool: True se a requisição for de leitura segura (GET, HEAD, OPTIONS) ou
            se o consumo de dados estiver abaixo da cota; False caso contrário.
        """
        # MARK: - Safe Methods Bypass
        if request.method in permissions.SAFE_METHODS:
            return True

        # MARK: - Storage & Database Limit Checks
        db_bytes = get_db_usage()
        storage_bytes = get_storage_usage()

        if db_bytes >= DB_LIMIT_BYTES:
            self.message = "Limite do banco de dados atingido. Novas criações estão temporariamente bloqueadas."
            return False

        if storage_bytes >= STORAGE_LIMIT_BYTES:
            self.message = "Limite de arquivos atingido. Novos uploads estão temporariamente bloqueados."
            return False

        return True
