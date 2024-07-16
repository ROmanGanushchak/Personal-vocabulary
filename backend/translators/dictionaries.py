import requests
from pprint import pprint

def translate_dictionaryapi_en(word: str):
    responce = requests.get(f'https://api.dictionaryapi.dev/api/v2/entries/en/{word}')
    pprint(responce.text)

translate_dictionaryapi_en('something')

