from django.contrib import admin
from .models import User, VerificationAwaitUser, PasswordChangeVerificationModel, UserTokens

admin.site.register(User)
admin.site.register(VerificationAwaitUser)
admin.site.register(PasswordChangeVerificationModel)
admin.site.register(UserTokens)