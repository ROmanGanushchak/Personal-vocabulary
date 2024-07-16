from datetime import datetime, timedelta, timezone
from django.db import models
import pytz, jwt
from accounts.models import User
from rest_framework import exceptions


class VerificationAwaitUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)
    verification_code = models.CharField(unique=True, max_length=8)


MAX_PASSWORD_CHANGE_TIME = 30
ACCESS_TOKEN_LEFITIME_MINUTES = 300


class PasswordChangeVerificationModel(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)
    verification_code = models.CharField(unique=True, max_length=8)
    request_time = models.DateTimeField(auto_now_add=True)

    def check_is_active(self) -> bool:
        return datetime.now(pytz.utc) - self.request_time < timedelta(minutes=MAX_PASSWORD_CHANGE_TIME)


class UserTokens(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True, related_name='tokens')
    access = models.CharField(unique=True, max_length=512, null=True, default=None)
    refresh = models.CharField(unique=True, max_length=512, null=True, default=None)

    def create_access_token(self):
        self.access = jwt.encode({
            'id': self.user.id,
            'exp': datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_LEFITIME_MINUTES),
            'iat': datetime.now(timezone.utc)
        }, 'access_secret', algorithm='HS256')
        self.save()
        return self.access
    
    def __create_refresh_token(self):
        self.refresh = jwt.encode({
            'id': self.user.id,
            'exp': datetime.now(timezone.utc) + timedelta(days=7),
            'iat': datetime.now(timezone.utc)
        }, 'refresh_secret', algorithm='HS256')
        self.save()
        return self.refresh
    
    def create_tokens(self):
        return self.create_access_token(), self.__create_refresh_token()

    @staticmethod
    def decode_access_token(token):
        try:
            id = jwt.decode(token, 'access_secret', algorithms='HS256')['id']
            user = User.objects.get(id=id)
            if (user.tokens.access == token and user.tokens.access != None):
                return user
            raise Exception
        except:
            raise exceptions.AuthenticationFailed('unauthenticated')

    @staticmethod
    def decode_refresh_token(token):
        try:
            id = jwt.decode(token, 'refresh_secret', algorithms='HS256')['id']
            user = User.objects.get(id=id)
            if (user.tokens.refresh == token):
                return user
            raise Exception
        except Exception as e:
            print(e)
            raise exceptions.AuthenticationFailed('unauthenticated')
    
    @staticmethod
    def create_access_for_user(user: User):
        try:
            userTokens: UserTokens = UserTokens.objects.get(user=user)
        except Exception as e:
            print("error in getting userTokens ->", e)
            raise exceptions.AuthenticationFailed('user doesnt exists or does not have an UserToken instance')
        
        return userTokens.create_access_token()
    
    @staticmethod
    def create_tokens_for_user(user: User):
        try:
            userTokens: UserTokens = UserTokens.objects.get(user=user)
        except Exception:
            raise exceptions.AuthenticationFailed('user doesnt exists or does not have an UserToken instance')
        
        return userTokens.create_tokens()