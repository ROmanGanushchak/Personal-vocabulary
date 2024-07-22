from functools import wraps
from typing import List
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

def extract_inputs(arg_names: List['str']):
    def decorator_function(original_function):
        @wraps(original_function)
        def wrapper_function(self, request: HttpRequest, *args, **kwargs):
            print(request.data)
            aditional_args = []
            for arg_name in arg_names:
                try:
                    aditional_args.append(request.data[arg_name])
                except KeyError:
                    return Response({'detail': f'The nececery argument {arg_name} was not provided'}, status=status.HTTP_400_BAD_REQUEST)
            
            return original_function(self, request, *aditional_args, *args, **kwargs)
        return wrapper_function
    return decorator_function