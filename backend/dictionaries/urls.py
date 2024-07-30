from django.urls import path
from .views import dictionary_views, entry_views

urlpatterns = [
    path('getword/<str:name>/<int:by_lang>/', entry_views.EntryGetView.as_view(), name="words"),
    path('addword/<str:name>/<int:by_lang>/<int:ignore_copy>/', entry_views.EntryCreateView.as_view(), name="words"),
    path('deleteentry/<str:name>/<int:id>/', entry_views.EntryDelete.as_view(), name='delete entry'),
    path('increaseGuesing/<str:name>/<int:id>/<int:rezult>/', entry_views.IncreaseGueasingCount.as_view(), name='increase the count of guess'),
    path('copyentry/', entry_views.EntryCopyToDifferentDictionary.as_view(), name="copy"),

    path('create/<str:name>/<str:lang>/<int:is_default>/', dictionary_views.DictionaryCreateView.as_view(), name="dicts create"),
    path('get/<str:name>/<int:searchType>/', dictionary_views.DectionaryGetView().as_view(), name="dicts get"),
    path('update/<str:name>/', dictionary_views.DictionaryUpdateView.as_view(), name='dict update'),
    path('delete/<str:name>/', dictionary_views.DictionaryDelete.as_view(), name='dict delete'),
    path('getlastindex/<str:name>/', dictionary_views.GetWordsCount.as_view(), name='get last index in dictionary'),
    path('mergetdicts/', dictionary_views.MergeDictionaries.as_view(), name='merge dicts'),
]
