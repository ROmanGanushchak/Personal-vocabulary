from django.db.models.signals import post_save
from django.dispatch import receiver
from accounts.models import User
from .models import DictionaryGroup

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        DictionaryGroup.objects.create(user=instance.profile)