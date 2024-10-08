from django.db.models.signals import post_save
from django.dispatch import receiver
from accounts.models import User
from .models import UserTokens

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        UserTokens.objects.create(user=instance)