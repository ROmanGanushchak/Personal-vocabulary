from datetime import datetime, timedelta
from django.db import models
import pytz
from accounts.models import User


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
