from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .email_sender import send_confirm_code, generate_verification_code, send_password_reset_code
from .models import User, VerificationAwaitUser, PasswordChangeVerificationModel
from .serializer import UserRegisterSerializer, LogoutSerializer


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
        print(varification_code, type(varification_code))
        verificator = get_object_or_404(VerificationAwaitUser, verification_code=varification_code)
        user: User = verificator.user
        if (user.is_verified is False):
            user.is_verified = True
            user.is_active = True
            user.save()

        refresh = RefreshToken.for_user(user)
        verificator.delete()

        return Response({"refresh": str(refresh), "access": str(refresh.access_token)}, status=status.HTTP_200_OK)


class PasswordChangeRequestView(APIView):
    def post(self, request):
        print("It is working")

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

        
class Logout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        if serializer.is_valid() and serializer.save():
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_400_BAD_REQUEST)