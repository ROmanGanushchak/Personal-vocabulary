from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializer import TranslateSerializer
from .serializer import translators
from .translate import Translator, TranslationError, GoogleTranslator
from authentication.decorators import authorized, extract_inputs
from .audio import get_audio

class TranslatorView(APIView):
    @authorized
    def post(self, request):
        serializer = TranslateSerializer(data=request.data)
        if (serializer.is_valid()):
            data = serializer.validated_data
            translator: Translator = translators[data.get('translator')]
            try:
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


class GetAudoView(APIView):
    @authorized
    @extract_inputs(['text', 'lang'])
    def post(self, request, text, lang_name):
        try:
            if lang_name == None:
                lang_code = None
            else:
                lang_code = GoogleTranslator.source_lang_to_code(lang_name)
        except Exception:
            return Response({'detail' : "This language is not supported"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            return get_audio(text, lang_code)
        except Exception as e: 
            print("exception: ")
            print(e)
            return Response({'detail' : "Error while getting speach from api"}, status=status.HTTP_400_BAD_REQUEST)