import os
from django.http import HttpResponse
from google.cloud import texttospeech, translate_v2 as translate

os.environ["GOOGLE_APPLICATION_CREDENTIALS"]=r"C:/Users/Roman/Desktop/django/google_auth_2/backend/translators/google_key.json"

from google.cloud import texttospeech

client = texttospeech.TextToSpeechClient()
detect_lang_client = translate.Client()
audio_config = texttospeech.AudioConfig(
    audio_encoding=texttospeech.AudioEncoding.MP3
)

def detect_language(text: str):
    result = detect_lang_client.detect_language(text)
    language_code = result['language']
    return language_code

def get_audio(text: str, language: str|None):
    if not text:
        print("Return none")
        return HttpResponse(None)

    if (language == None):
        language = detect_language(text)

    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code=language, ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )

    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )

    return HttpResponse(response.audio_content, content_type="audio/mp3")

if __name__ == "__main__":
    get_audio('something', 'en-US')