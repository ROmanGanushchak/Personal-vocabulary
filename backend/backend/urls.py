from django.contrib import admin
from django.urls import include, path
from .view import ConnectionChecker
from translators.views import TranslatorView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include("authentication.urls")),
    path('social_auth/', include("google_auth.urls")),
    path('connection/check/', ConnectionChecker.as_view(), name='connection checker'),
    path('dictionary/', include('dictionaries.urls')),
    path('translate/', include('translators.urls'), name="translator"),
]
