from rest_framework import serializers
from .models        import Entry, Dictionary, SortingTypes
from django.shortcuts import get_object_or_404

class WriteEntrySerializer(serializers.ModelSerializer):
    translates = serializers.SerializerMethodField()

    class Meta(object):
        model = Entry
        fields = ['word', 'translates', 'notes', 'adding_time', 'guessed_num', 'guessing_attempts', 'id']
    
    def get_translates(self, obj: Entry):
        return obj.translates.get_arr()


class DictionarySerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Dictionary
        fields = ['language', 'is_default', 'name', 'date_created', 'words_count', 'words_per_page', 'sort_type', 'id']
        read_only_fields = tuple('words_count')