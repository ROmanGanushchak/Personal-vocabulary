from django.urls import path
from . import views

urlpatterns = [
    path('getword/<str:name>/<int:by_lang>/words/', views.WordPairGetView.as_view(), name="words"),
    path('addword/<str:name>/<int:by_lang>/words/<int:ignore_copy>/', views.WordPairCreateView.as_view(), name="words"),
    path('create/<str:name>/<str:lang>/<int:is_default>/', views.DictionaryCreateView.as_view(), name="dicts create"),
    path('get/<str:name>/<int:searchType>/', views.DectionaryGetView().as_view(), name="dicts get"),
    path('update/<str:name>/', views.DictionaryUpdateView.as_view(), name='dict update'),
    path('delete/<str:name>/', views.DictionaryDelete.as_view(), name='dict delete')
]
