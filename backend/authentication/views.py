from datetime import timedelta, datetime
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate
from django.http import HttpRequest
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, Token
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.exceptions import AuthenticationFailed
from backend import settings
from .decorators import authorized

from .email_sender import send_confirm_code, generate_verification_code, send_password_reset_code
from .models import User, VerificationAwaitUser, PasswordChangeVerificationModel, UserTokens
from .serializer import UserRegisterSerializer


# SIMPLE_JWT = {
#     'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
#     'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
#     'ROTATE_REFRESH_TOKENS': False,
#     'BLACKLIST_AFTER_ROTATION': True,
#     'AUTH_COOKIE': 'refresh_token',  # Cookie name. Enables cookies if value is set.
#     'AUTH_COOKIE_DOMAIN': None,     # A string like "example.com", or None for standard domain cookie.
#     'AUTH_COOKIE_SECURE': False,    # Whether the auth cookies should be secure (https:// only).
#     'AUTH_COOKIE_HTTP_ONLY' : True, # Http only cookie flag.It's not fetch by javascript.
#     'AUTH_COOKIE_PATH': '/',        # The path of the auth cookie.
#     'AUTH_COOKIE_SAMESITE': 'Lax',  # Whether to set the flag restricting cookie leaks on cross-site requests.
# }

REGRESH_TOKEN_LIFETIME = 30
REFRESH_SETTINGS = {
    "AUTH_COOKIE": "refresh_token",
    "AUTH_COOKIE_SECURE": False,
    "AUTH_COOKIE_HTTP_ONLY": True,
    "AUTH_COOKIE_SAMESITE": 'Lax',
}


def provideUserTokens(user: User):
    access, refresh = UserTokens.create_tokens_for_user(user)
    response = Response()
    # response.set_cookie(
    #     key = REFRESH_SETTINGS['AUTH_COOKIE'], 
    #     value = refresh,
    #     expires = timedelta(days=REGRESH_TOKEN_LIFETIME),
    #     secure = REFRESH_SETTINGS['AUTH_COOKIE_SECURE'],
    #     httponly = REFRESH_SETTINGS['AUTH_COOKIE_HTTP_ONLY'],
    #     samesite = REFRESH_SETTINGS['AUTH_COOKIE_SAMESITE'],
    #     max_age=30*24*60*50,
    # )
    response.set_cookie(
        'refreshToken', 
        refresh, 
        max_age=7 * 24 * 60 * 60,  # Expires in 7 days (in seconds)
        secure=False,              # Ensures the cookie is sent over HTTPS
        httponly=True,            # Prevents access by JavaScript
        samesite='None'         # Restricts cookie to same-site requests only
    )
    response.data = {"access" : access}
    return response


class RegisterUserView(APIView):
    serializer_class = UserRegisterSerializer

    def post(self, request):
        serializer = self.serializer_class(data = request.data)
        if (serializer.is_valid()):
            user: User = serializer.save()
            user.is_verified = False
            user.save()

            verification_code: str = generate_verification_code()
            try:
                VerificationAwaitUser.objects.create(user=user, verification_code=verification_code)
            except Exception:
                old_verification = VerificationAwaitUser.objects.get(user=user)
                old_verification.delete()
                VerificationAwaitUser.objects.create(user=user, verification_code=verification_code)

            send_confirm_code(user.email, verification_code)

            return Response({'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'detail': 'Invalid data for registration'}, status=status.HTTP_400_BAD_REQUEST)


class VerificationAwaitView(APIView):
    def post(self, request, varification_code):
        verificator = get_object_or_404(VerificationAwaitUser, verification_code=varification_code)
        user: User = verificator.user
        if (user.is_verified is False):
            user.is_verified = True
            user.is_active = True
            user.save()

        return Response({"all good"})


class PasswordChangeRequestView(APIView):
    def post(self, request):
        try:
            email = request.data['email']
            user = User.objects.get(email=email)
        except Exception:
            return Response({'detail': "No email was specified or their is no user with such email"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            verification = PasswordChangeVerificationModel.objects.get(user = user)
            verification.delete()
        except ObjectDoesNotExist:
            pass
            
        verification = PasswordChangeVerificationModel.objects.create(user=user, verification_code=generate_verification_code())
        send_password_reset_code(user.email, verification.verification_code)

        return Response({'detail': 'email sent'})
        

class PasswordChangeValidatorView(APIView):
    def post(self, request):
        if (not ("password_reset_token" in request.data and "new_password" in request.data)):
            return Response({'detail': "Uncorrect input data"}, status=status.HTTP_400_BAD_REQUEST)
        
        verification_token = request.data['password_reset_token']
        new_password = request.data['new_password']

        try:
            verificator = PasswordChangeVerificationModel.objects.get(verification_code=verification_token)
            if (not verificator.check_is_active()):
                verificator.delete()
                raise ObjectDoesNotExist
        except ObjectDoesNotExist:
            return Response({'detail': 'Token is not active'}, status=status.HTTP_404_NOT_FOUND)
        
        user = verificator.user
        user.set_password(new_password)
        user.save()

        verificator.delete()
        return Response({'detail': 'password was changed'})


class Login(APIView):
    def post(self, request: HttpRequest):
        try:
            email = request.data['email']
            password = request.data['password']
        except KeyError:
            return Response({'detail': 'Not all data were provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        print("Trying find user")
        user = authenticate(email=email, password=password)
        if (user):
            return provideUserTokens(user)
        return Response({"detail": "No user was found"}, status=status.HTTP_404_NOT_FOUND)
            

class RefreshToken(APIView):
    def post(self, request: HttpRequest):
        print("In refresh post func")
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
        print(f"Refresh -> {refresh_token}")

        if not refresh_token:
            return Response({"error": "Refresh token not found"}, status=400)
        
        try:
            user: User = UserTokens.decode_refresh_token(refresh_token)
            try:
                access_token = str(UserTokens.create_access_for_user(user))
            except AuthenticationFailed:
                return Response("Provided refresh token is not active")
            return Response({"access": access_token})
        except Exception:
            return Response({"error": "Invalid refresh token"}, status=400)


        
class Logout(APIView):
    @authorized
    def post(self, request):
        try:
            access = request.data['access']
            refresh = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
            user: User = request.user
        except KeyError:
            return Response("Not all data were provided", status=status.HTTP_400_BAD_REQUEST)
        
        user.tokens.access = None
        user.tokens.refresh = None
        user.tokens.save()
        return Response("Succesfull logout")
