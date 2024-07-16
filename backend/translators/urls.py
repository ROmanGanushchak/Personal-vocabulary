from django.urls import path
from . import views

urlpatterns = [
    path('', views.Translator.as_view(), name="translate")
]
