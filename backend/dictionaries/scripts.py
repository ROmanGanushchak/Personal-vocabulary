from typing import List
from .models import Dictionary, Entry

def updateAllDictEntryCount():
    dicts: List[Dictionary] = Dictionary.objects.all()
    for dict in dicts:
        dict.recalculateWordsCount()