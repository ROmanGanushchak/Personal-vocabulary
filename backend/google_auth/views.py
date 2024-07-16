from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.exceptions import GoogleAuthError
from google.auth.transport import requests
from rest_framework_simplejwt.tokens import RefreshToken, Token
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny
from authentication.views import provideUserTokens

from backend import settings
from accounts.models import User, AuthProviders    
from .utils import get_or_create_socialuser, UncorrectAuthProvider

class GoogleSignInView(APIView):
    def post(self, request):
        try:
            access_token = request.data['access_token']
        except KeyError:
            return Response({'defail': 'The google access token wasnt specified'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            id_info = id_token.verify_oauth2_token(access_token, requests.Request(), settings.GOOGLE_CLIENT_ID, clock_skew_in_seconds=10)
            if id_info['iss'] not in ["https://accounts.google.com", "accounts.google.com"]:
                return Response({'degail': 'The auth provider seems to be not google'}, status=status.HTTP_403_FORBIDDEN)
        except GoogleAuthError as e:
            print(e)
            return Response({'detail': 'Google api didnt provide the data, try the regular registration or try it later'}, status=status.HTTP_404_NOT_FOUND)
        
        email: str = id_info.get('email')
        first_name: str = id_info.get('given_name')
        last_name: str = id_info.get('family_name', "unknown")

        try:
            user: User = get_or_create_socialuser(AuthProviders.Google, email, first_name, last_name)
            print("User found")
            return provideUserTokens(user)
        except UncorrectAuthProvider:
            return Response({'detail': "This email is taken by a user with different authentication type"}, status=status.HTTP_404_NOT_FOUND)
