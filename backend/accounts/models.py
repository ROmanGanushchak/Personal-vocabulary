from enum import Enum
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from datetime import datetime, timedelta
import pytz

from .manager import UserManager

AUTH_PROVIDERS = {'email': 'email', 'google': 'google'}
class AuthProviders(Enum):
    Email = 1
    Google = 2

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True, verbose_name=_("Email Address"))
    first_name = models.CharField(max_length=64, verbose_name=_("First Name"))
    last_name = models.CharField(max_length=64, verbose_name=_("Last Name"))
    is_superuser = models.BooleanField(default=False)
    is_verified  = models.BooleanField(default=False)
    is_staff     = models.BooleanField(default=False)
    is_active    = models.BooleanField(default=True)
    date_joined  = models.DateTimeField(auto_now_add=True)
    auth_provider= models.IntegerField(choices=[(auth.value, auth.name) for auth in AuthProviders], default=AuthProviders.Email.value)

    USERNAME_FIELD="email"

    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = UserManager()

    def __str__(self):
        return self.email
    
    @property
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    # @property
    # def email(self):
    #     return self.email

    def tokens(self):
        pass


class VerificationAwaitUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)
    verification_code = models.CharField(unique=True, max_length=8)


MAX_PASSWORD_CHANGE_TIME = 30


class PasswordChangeVerificationModel(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)
    verification_code = models.CharField(unique=True, max_length=8)
    request_time = models.DateTimeField(auto_now_add=True)

    def check_is_active(self) -> bool:
        return datetime.now(pytz.utc) - self.request_time < timedelta(minutes=MAX_PASSWORD_CHANGE_TIME)
