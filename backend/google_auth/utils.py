from accounts.models import User
from django.core.exceptions import ObjectDoesNotExist
import string
import random
from accounts.models import AuthProviders

class UncorrectAuthProvider(Exception):
    pass

def createRandomPassword(length: int = 128):
    return "".join([random.SystemRandom().choice(string.ascii_letters + string.digits) for _ in range(length)])


def get_or_create_socialuser(auth_provider: AuthProviders, email, first_name, last_name) -> User:
    try:
        user: User = User.objects.get(email=email)
        if (int(user.auth_provider) != auth_provider.value):
            raise UncorrectAuthProvider
        return user
    except ObjectDoesNotExist:
        user: User = User.objects.create_user(email, first_name, last_name, createRandomPassword())
        user.auth_provider = int(auth_provider.value)
        user.is_verified = True
        user.save()
        return user
