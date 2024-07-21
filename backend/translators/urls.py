from django.urls import path
from . import views

urlpatterns = [
    path('getaudio/', views.GetAudoView.as_view(), name="audio"),
    path('', views.TranslatorView.as_view(), name="translate")
]
