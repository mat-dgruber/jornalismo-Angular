
import json
from firebase_admin import auth, credentials
import firebase_admin
from rest_framework import authentication
from rest_framework import exceptions
from django.contrib.auth.models import User
from django.conf import settings
import os
# Initialize Firebase Admin SDK if not already initialized
if not firebase_admin._apps:
    base_dir = settings.BASE_DIR
    local_cred_path = os.path.join(base_dir, 'certs', 'serviceAccountKey.json')
    env_cred_path = os.getenv('FIREBASE_CREDENTIALS_PATH')
    json_cred_env = os.getenv('FIREBASE_SERVICE_ACCOUNT_JSON')

    # Force the project ID from environment or default to the correct one
    firebase_project_id = os.getenv('FIREBASE_PROJECT_ID', 'portfolio-jornalismo')
    options = {'projectId': firebase_project_id}

    if json_cred_env:
        # Load from JSON string in environment variable
        try:
            cred_dict = json.loads(json_cred_env)
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred, options=options)
        except Exception as e:
            print(f"Firebase ERROR: Failed to initialize from JSON env: {e}")
    elif env_cred_path:
        # Load from file path in environment variable
        cred = credentials.Certificate(env_cred_path)
        firebase_admin.initialize_app(cred, options=options)
    elif os.path.exists(local_cred_path):
        # Load from local file (Dev)
        cred = credentials.Certificate(local_cred_path)
        firebase_admin.initialize_app(cred, options=options)
    else:
        # Fallback for ADC (Cloud Run default)
        try:
             firebase_admin.initialize_app(options=options)
             print(f"Firebase: Initialized using Default Credentials for project {firebase_project_id}")
        except Exception as e:
            print(f"Firebase: Failed to initialize with ADC: {e}")

class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            # print("FirebaseAuthentication: No Authorization header found")
            return None

        # print("FirebaseAuthentication: Header found:", auth_header[:20] + "...")
        id_token = auth_header.split(' ').pop()
        decoded_token = None
        
        try:
            decoded_token = auth.verify_id_token(id_token)
        except Exception as e:
            print(f"FirebaseAuthentication ERROR: Token verification failed: {e}")
            raise exceptions.AuthenticationFailed(f'Invalid Firebase token: {e}')

        if not decoded_token:
            print("FirebaseAuthentication ERROR: No decoded token")
            return None

        uid = decoded_token.get('uid')
        email = decoded_token.get('email')
        
        if not email:
             raise exceptions.AuthenticationFailed('Firebase token has no email')

        # Get or create the user
        try:
            user = User.objects.get(username=uid)
        except User.DoesNotExist:
            try:
                user = User.objects.create_user(username=uid, email=email)
                print(f"FirebaseAuthentication: Created new user for uid: {uid}")
            except Exception as e:
                print(f"FirebaseAuthentication ERROR during user creation: {e}")
                user = User.objects.get(username=uid)

        return (user, None)
