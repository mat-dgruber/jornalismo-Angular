# MARK: - Imports & Dependencies
import os
import firebase_admin
from firebase_admin import auth, credentials
from django.contrib.auth.models import User
from rest_framework import authentication, exceptions

# MARK: - Firebase SDK Initialization
# Inicializa o Firebase Admin SDK prioritariamente via Application Default Credentials (ADC)
# ou por arquivo de credenciais definido em variável de ambiente.
try:
    if not firebase_admin._apps:
        cred_path = os.environ.get('FIREBASE_CREDENTIALS_PATH')
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            # Fallback seguro para GCP Cloud Run (ADC) ou inicialização padrão
            firebase_admin.initialize_app()
except Exception as e:
    print(f"Aviso de inicialização do Firebase Admin SDK: {e}")

# MARK: - Authentication Class
class FirebaseAuthentication(authentication.BaseAuthentication):
    """Classe de autenticação customizada para o Django REST Framework via Firebase Auth JWT.

    Valida o token Bearer enviado no cabeçalho 'Authorization' contra as chaves públicas
    do Firebase e sincroniza/obtém o usuário correspondente no Django User Model.
    """

    def authenticate(self, request):
        """Autentica a requisição HTTP verificando o token Bearer do Firebase.

        Args:
            request (rest_framework.request.Request): Objeto da requisição HTTP do Django.

        Returns:
            tuple[User, dict] | None: Tupla contendo a instância de User do Django e o payload
            decodificado do token JWT se autenticado com sucesso, ou None se nenhum token for enviado.

        Raises:
            exceptions.AuthenticationFailed: Se o token for inválido, expirado ou revogado.
        """
        # MARK: - Header Extraction
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None

        parts = auth_header.split()
        if parts[0].lower() != 'bearer':
            return None

        if len(parts) == 1:
            raise exceptions.AuthenticationFailed('Cabeçalho de autorização inválido: Nenhum token fornecido.')
        elif len(parts) > 2:
            raise exceptions.AuthenticationFailed('Cabeçalho de autorização inválido: Token contém espaços extras.')

        id_token = parts[1]

        # MARK: - JWT Token Verification
        try:
            # Decodifica e valida a assinatura criptográfica do ID Token no Firebase
            decoded_token = auth.verify_id_token(id_token)
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Token do Firebase inválido ou expirado: {str(e)}')

        # MARK: - Django User Sync
        uid = decoded_token.get('uid')
        email = decoded_token.get('email', '')

        # Localiza ou cria o usuário espelho no Django baseado no UID único do Firebase
        user, created = User.objects.get_or_create(
            username=uid,
            defaults={'email': email}
        )

        return (user, decoded_token)
