from django.contrib import admin
from .models import Dictionary, WordPair, DictionaryGroup

# Register your models here.
admin.site.register(Dictionary)
admin.site.register(WordPair)
admin.site.register(DictionaryGroup)