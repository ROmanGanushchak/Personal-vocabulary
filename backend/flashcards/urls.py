from django.urls import path
from .views import GetFlashCards

urlpatterns = [
    path('<str:dictName>/<int:count>/<int:lastWordIndex>/', GetFlashCards.as_view(), name='get flashcards')
]