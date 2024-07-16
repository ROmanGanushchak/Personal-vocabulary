from functools import wraps
from django.core.exceptions import ValidationError
from .models import UserTokens
from accounts.models import User
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpRequest
import sys

AUTHORIZATION_HEADER = 'Authorization'

def authorized(original_function):
    @wraps(original_function)
    def wrapper_function(self, request: HttpRequest, *args, **kwargs):
        access_header: str = request.META.get('HTTP_AUTHORIZATION')
        print(f"Access header -> {access_header}")
        if (not access_header):
            try:
                access: str = request.data['access']
            except Exception:
                return Response({'detail': "No access token was provided'"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            try:
                access: str = access_header.split(" ")[1]
            except Exception:
                return Response({'detail': "Uncorrect auth header format"}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            user: User = UserTokens.decode_access_token(access)
        except AuthenticationFailed:
            return Response({'detail': "The token has expired or doesnt exists"}, status=status.HTTP_401_UNAUTHORIZED)
        
        request.user = user
        return original_function(self, request, *args, **kwargs)
    return wrapper_function