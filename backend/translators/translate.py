import os
from google.cloud import translate_v2 as translate
from iso639 import Lang
import deepl
from backend.settings import DEEPL_AUTH_KEY
from abc import ABC, abstractmethod
# from azure.core.credentials import AzureKeyCredential
# from azure.ai.translation.text import TextTranslationClient
from uuid import uuid4

class TranslationError(Exception):
    pass


class Translator(ABC):
    def translateText(text, language, source_language):
        pass

    @staticmethod
    def isSourceInLangs(sourceLang: str):
        pass
    
    @staticmethod
    def isTargetInLangs(targetLang: str):
        pass

    @staticmethod
    def source_lang_to_code(langName: str):
        pass

    @staticmethod
    def target_lang_to_code(langName: str):
        pass

    @staticmethod
    def convert_to_isocode(langName: str):
        try:
            lang = Lang(langName)
        except Exception:
            return ""
        if (lang.pt1):
            return lang.pt1
        if (lang.pt2b):
            return lang.pt2b
        if (lang.pt2t):
            return lang.pt2t
        return lang.pt3


class GoogleTranslator(Translator):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"]=r"C:/Users/Roman/Desktop/django/google_auth_2/backend/translators/google_key.json"
    client = translate.Client()
    supported_langs = {lang['language'] for lang in client.get_languages()}

    @staticmethod
    def translateText(text: str, language: str, source_language: str = None):
        if (language == source_language):
            return text, language

        if (language not in GoogleTranslator.supported_langs):
            raise TranslationError("Google does not support this target language")
        if (language and language != "none" and language not in GoogleTranslator.supported_langs):
            raise TranslationError("Google does not support this source language")

        translated = GoogleTranslator.client.translate(
            text, 
            target_language = language, 
            source_language = None if source_language == "none" else source_language
        )
        
        if (source_language):
            return translated['translatedText'], source_language
        return (translated['translatedText'], Lang(translated['detectedSourceLanguage']).name)
    
    @staticmethod
    def isSourceInLangs(sourceLang: str):
        return sourceLang in GoogleTranslator.supported_langs

    @staticmethod
    def isTargetInLangs(targetLang: str):
        return targetLang in GoogleTranslator.supported_langs
    
    @staticmethod
    def source_lang_to_code(langName: str):
        return Translator.convert_to_isocode(langName)
    
    @staticmethod
    def target_lang_to_code(langName: str):
        return Translator.convert_to_isocode(langName)
    

class DeeplTranslator(Translator):
    translator = deepl.Translator(DEEPL_AUTH_KEY)
    source_langs = {lang.code for lang in translator.get_source_languages()}
    target_langs = {lang.code for lang in translator.get_target_languages()}

    @staticmethod
    def source_lang_to_code(langName: str):
        return Translator.convert_to_isocode(langName).upper()
    
    @staticmethod
    def target_lang_to_code(langName: str):
        if (langName.lower() == 'english'):
            return 'EN-GB'
        return Translator.convert_to_isocode(langName).upper()

    @staticmethod
    def translateText(text: str, lang: str, source_lang: str = None):
        if (lang not in DeeplTranslator.target_langs):
            raise TranslationError("Deepl does not support this target language")
        
        if (source_lang and source_lang != 'none' and source_lang not in DeeplTranslator.source_langs):
            raise TranslationError("Deepl does not support this source language")

        translated = DeeplTranslator.translator.translate_text(
            text, target_lang=lang, 
            source_lang = source_lang if source_lang != 'none' else None)
        return (translated.text, Lang(translated.detected_source_lang.lower()).name)
    
    @staticmethod
    def isSourceInLangs(sourceLang: str):
        return sourceLang in DeeplTranslator.source_langs

    @staticmethod
    def isTargetInLangs(targetLang: str):
        return targetLang in DeeplTranslator.target_langs


# BING_API_KEY = "131531279cd94b69ae02d65b24fbb5b5"
# BING_ENDPOINT = "https://api.cognitive.microsofttranslator.com/"

# class BingTranslator(Translator):
#     credential = AzureKeyCredential(BING_API_KEY)
#     text_translator = TextTranslationClient(credential=credential, endpoint=BING_ENDPOINT, region='westeurope')
#     iso_to_bing_lang_map = {"zh": "zh-Hans","zh-Hant": "zh-Hant","he": "he", "id": "id","no": "no", "nb": "no",   "nn": "no",  "sr": "sr-Cyrl",  "sr-Latn": "sr-Latn","zh-Hans": "zh-Hans", "zh-Hant": "zh-Hant", "pt-PT": "pt-PT",  "pt-BR": "pt-BR", "es-ES": "es-ES", "es-MX": "es-MX", "es-419": "es-419"}
#     bing_to_iso = {v: k for k, v in iso_to_bing_lang_map.items()}
#     languages = {lang_code for lang_code in text_translator.get_supported_languages()['translation']}

#     @staticmethod
#     def convert_to_code(langName: str):
#         lang = Translator.convert_to_isocode(langName)
#         if (langCode := BingTranslator.iso_to_bing_lang_map.get(lang)):
#             return langCode
#         return lang
    
#     @staticmethod
#     def source_lang_to_code(langName: str):
#         lang = Translator.convert_to_isocode(langName)
#         if (langCode := BingTranslator.iso_to_bing_lang_map.get(lang)):
#             return langCode
#         return lang
    
#     @staticmethod
#     def target_lang_to_code(langName: str):
#         return BingTranslator.source_lang_to_code(langName)

#     @staticmethod
#     def translateText(text: str, lang: str, source_lang: str = None):
#         if (lang not in BingTranslator.languages):
#             raise TranslationError("Bing does not support this target language")
#         if (source_lang and source_lang != 'none' and source_lang not in BingTranslator.languages):
#             raise TranslationError("Bing does not support this source language")

#         response = BingTranslator.text_translator.translate(
#             body=[text], to_language=[lang], 
#             from_language=None if (source_lang == 'none') else source_lang
#         )
#         translated: str = response[0]['translations'][0]['text']
        
#         if (source_lang != None):
#             lang = Lang(source_lang).name
#         else:
#             langCode = response[0]['detectedLanguage']['language']
#             if (langCode in BingTranslator.bing_to_iso):
#                 lang = Lang(BingTranslator.bing_to_iso(langCode)).name
#             else:
#                 lang = Lang(langCode).name

#         return (translated, lang)

#     @staticmethod
#     def isSourceInLangs(sourceLang: str):
#         return sourceLang in BingTranslator.languages

#     @staticmethod
#     def isTargetInLangs(targetLang: str):
#         return targetLang in BingTranslator.languages