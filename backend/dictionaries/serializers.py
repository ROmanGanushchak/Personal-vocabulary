from rest_framework import serializers
from .models        import WordPair, Dictionary
from django.shortcuts import get_object_or_404

class WordPairSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = WordPair
        fields = ['native_word', 'learned_word']
    
    def create(self, validated_data):
        dictionary = get_object_or_404(Dictionary, type=self.context.get("language_type"))
        instance = WordPair.objects.create(
            native_word  = validated_data.get("native_word"),
            learned_word = validated_data.get("learned_word"),
            dictionary = dictionary
        )

        return instance


class DictionarySerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Dictionary
        fields = ['language', 'is_default', 'name', 'date_created', 'words_count']
        read_only_fields = tuple('words_count')
