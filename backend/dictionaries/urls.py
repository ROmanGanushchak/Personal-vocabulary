from django.urls import path
from . import views

urlpatterns = [
    path('<int:id>/words/', views.WordPairView.as_view(), name="words"),
    path('', views.DictionaryView.as_view(), name="dicts")
]
