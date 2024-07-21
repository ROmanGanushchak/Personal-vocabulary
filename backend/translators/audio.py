import os
from django.http import HttpResponse

os.environ["GOOGLE_APPLICATION_CREDENTIALS"]=r"C:/Users/Roman/Desktop/django/google_auth_2/backend/translators/google_key.json"

from google.cloud import texttospeech

client = texttospeech.TextToSpeechClient()
audio_config = texttospeech.AudioConfig(
    audio_encoding=texttospeech.AudioEncoding.MP3
)

def get_audio(text: str, language: str):
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