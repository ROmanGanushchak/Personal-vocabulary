from rest_framework import serializers
from .translate import GoogleTranslator, DeeplTranslator, Translator #, BingTranslator

translators = {"google": GoogleTranslator, "deepl": DeeplTranslator} #, 'bing': BingTranslator

class TranslateSerializer(serializers.Serializer):
    translator = serializers.CharField(required=True)
    sourceLang = serializers.CharField(required=True)
    targetLang = serializers.CharField(required=True)
    text = serializers.CharField(required=True)

    class Meta:
        fields = ['translator', 'sourceLang', 'targetLang', 'text']
    
    def validate(self, attrs):
        print(f"ATTRS -> {attrs}")
        try:
            translator_name = attrs['translator']
            sourceLang = attrs['sourceLang']
            targetLang = attrs['targetLang']
            text = attrs['text']
        except KeyError:
            raise serializers.ValidationError("Not all data were specified")

        if (translator_name not in translators):
            raise serializers.ValidationError("This translator is unsuppored")
        if (not len(text)):
            raise serializers.ValidationError("")
        return attrs