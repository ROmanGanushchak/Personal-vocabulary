from django.contrib import admin
from django.urls import include, path
from .view import ConnectionChecker

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include("accounts.urls")),
    path('social_auth/', include("google_auth.urls")),
    path('connection/check/', ConnectionChecker.as_view(), name='connection checker'),
]
