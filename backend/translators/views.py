from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializer import TranslateSerializer
from .serializer import translators
from .translate import Translator, TranslationError
from authentication.decorators import authorized

class TranslatorView(APIView):
    @authorized
    def post(self, request):
        print("In Translate func")
        serializer = TranslateSerializer(data=request.data)
        if (serializer.is_valid()):
            print("In if")
            data = serializer.validated_data
            translator: Translator = translators[data.get('translator')]
            try:
                print("Try to translate")
                translatedText, lang = translator.translateText(
                    data.get("text"), 
                    translator.target_lang_to_code(data.get("targetLang")),
                    translator.source_lang_to_code(data.get("sourceLang")) 
                )
                return Response({"translated": translatedText, "lang": lang})
            except TranslationError as e:
                print(e)
                return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
