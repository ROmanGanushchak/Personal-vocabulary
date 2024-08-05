from typing import List
from enum import Enum

# from dictionaries.models import Entry

class PriorityTypes(Enum):
    CommonlyAdded = 30
    LeastQuesed = 20
    Misspealed = 15
    FormerlyAdded = 20
    RecentlyAdded = 20

def getFlashCardBasicFactor(copyCount: int, quesed: List[int], misspeledCount: int) -> int:
    return (copyCount * PriorityTypes.CommonlyAdded.value +
            (quesed[0]-quesed[1]) * PriorityTypes.LeastQuesed.value +
            misspeledCount*PriorityTypes.Misspealed.value)

def getFlashCardBasicFactorByEntry(entry) -> int:
    copyCount = entry.dictionary.words.filter(word=entry.word).count() - 1
    quesed = [entry.guessed_num, entry.guessing_attempts]
    misspeledCount = 0

    return getFlashCardBasicFactor(copyCount, quesed, misspeledCount)