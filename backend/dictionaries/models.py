from django.db import models
from django.core.exceptions import ObjectDoesNotExist
from accounts.models import UserProfile, User

MAX_WORD_LENGTH = 64

class DictionaryGroup(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name = 'dictionary_group', unique=True)


class Dictionary(models.Model):
    name = models.CharField(max_length=64)
    is_default = models.BooleanField(default=False)
    language = models.CharField(max_length=16, default='en')
    date_created = models.DateField(auto_now_add=True)
    words_count = models.IntegerField(default=0)
    group = models.ForeignKey(DictionaryGroup, on_delete=models.CASCADE, related_name = 'dictionaries')

    class Meta:
        unique_together = (('name', 'group'))

    @staticmethod
    def get(user: User, name: str, by_lang: bool):
        if (by_lang):
            return DictionaryGroup.objects.get(user=user).dictionaries.get(language=name, is_default=True)
        else:
            return DictionaryGroup.objects.get(user=user).dictionaries.get(name=name)

    def add_word_pair(self, ignore_copy: int, native_word: str, learned_word: str) -> list | None:
        if (not ignore_copy):
            added_words = self.words.filter(native_word=native_word)
            if (added_words):
                return added_words

        WordPair.objects.create(native_word = native_word, learned_word = learned_word, dictionary = self)
        self.words_count += 1
        return None

    def get_last_page_index(self, words_per_page: int):
        return int(self.words.count() / words_per_page) * words_per_page
    
    def update_data(self, newData: dict) -> None: # пріколи з нейм і його унікальністю
        if ((name := newData.get('name')) and name != self.name):
            try:
                Dictionary.get(self.group.user, name, False)
                raise Exception("Dictionary with the same name already exists")
            except ObjectDoesNotExist:
                self.name = name

        props_types = [['is_default', bool]]
        props = []

        for prop_name, prop_type in props_types:
            if ((prop := newData.get(prop_name)) != None):
                if (type(prop) == prop_type):
                    props.append([prop_name, prop])
                else:
                    raise Exception(f"The parametr {prop_name} has uncorrect type")
                
        for prop_name, prop in props:
            try:
                setattr(self, prop_name, prop)
            except Exception:
                raise Exception(f"Failed to set attribute {prop_name}")
        
        self.save()


class WordPair(models.Model):
    native_word  = models.CharField(max_length = MAX_WORD_LENGTH)
    learned_word = models.CharField(max_length = MAX_WORD_LENGTH)
    adding_time  = models.DateTimeField(auto_now_add=True)
    dictionary   = models.ForeignKey(Dictionary, on_delete=models.CASCADE, related_name='words')