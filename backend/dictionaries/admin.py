from django.contrib import admin
from .models import Dictionary, Entry, DictionaryGroup

# Register your models here.
admin.site.register(Dictionary)
admin.site.register(Entry)
admin.site.register(DictionaryGroup)