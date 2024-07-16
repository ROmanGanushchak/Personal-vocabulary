from django.db import models
# from autorization.models import UserProfile
from accounts.models import UserProfile

MAX_WORD_LENGTH = 64

class Dictionary(models.Model):
    learned_language = models.CharField(max_length=64)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name = 'dictionaries')  

    def add_word_pair(self, ignore_copy: bool, native_word: str, learned_word: str) -> list | None:
        if (not ignore_copy):
            added_words = self.words.filter(native_word=native_word)
            if (added_words):
                return added_words

        WordPair.objects.create(native_word = native_word, learned_word = learned_word, dictionary = self)
        return None


class WordPair(models.Model):
    native_word  = models.CharField(max_length = MAX_WORD_LENGTH)
    learned_word = models.CharField(max_length = MAX_WORD_LENGTH)
    adding_time  = models.DateTimeField(auto_now_add=True)
    dictionary   = models.ForeignKey(Dictionary, on_delete=models.CASCADE, related_name='words')
