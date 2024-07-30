from __future__ import annotations
from enum import Enum
from typing import List
from django.db import models
from django.db.models import ExpressionWrapper, F, Q, IntegerField
from django.core.exceptions import ObjectDoesNotExist
from accounts.models import UserProfile, User

MAX_WORD_LENGTH = 64

class SortingTypes(models.IntegerChoices):
    AddingTime = 1, 'Time'
    AddingTimeReverse = 2, 'TimeReverse'
    LeastQuased = 3, 'LeastQuesed'
    LeastSpelled = 4, 'LeastSpelled'

class SearchTypes(Enum):
    Word = 0
    Translates = 1
    Notes = 2
    AddingTime = 3

    @classmethod
    def values(cls):
        return {type.value for type in cls}


class DictionaryGroup(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name = 'dictionary_group', unique=True)


class Dictionary(models.Model):
    name = models.CharField(max_length=64)
    is_default = models.BooleanField(default=False)
    language = models.CharField(max_length=16, default='en')
    date_created = models.DateField(auto_now_add=True)
    words_per_page = models.IntegerField(default=20)
    words_count = models.IntegerField(default=0)
    sort_type = models.IntegerField(choices=SortingTypes.choices, default=SortingTypes.AddingTime)
    group = models.ForeignKey(DictionaryGroup, on_delete=models.CASCADE, related_name = 'dictionaries')

    class Meta:
        unique_together = (('name', 'group'))

    @staticmethod
    def get(user: User, name: str, by_lang: bool):
        if (by_lang):
            return DictionaryGroup.objects.get(user=user).dictionaries.get(language=name, is_default=True)
        else:
            return DictionaryGroup.objects.get(user=user).dictionaries.get(name=name)

    def add_word_pair(self, ignore_copy: int, word: str, translates: str, note: str=None) -> list | None:
        if (not ignore_copy):
            added_words = self.words.filter(word=word)
            if (added_words):
                return added_words

        Entry.create(word = word, notes=note, dictionary = self, translates=translates)
        self.words_count += 1
        self.save()
        return None
    
    def add_entry(self, entry: Entry, type: int=0) -> bool: # type - 0 ignorecopy, 1-update_with new, 2-keep both 
        try:
            same_entries: List[Entry] = self.words.objects.filter(word=entry.word)
        except Exception:
            same_entries = []
        
        match (type):
            case 0:
                if (len(same_entries) == 0):
                    entry.copy(self)
            case 1:
                for entry in same_entries:
                    entry.delete()
                entry.copy(self)
            case 2:
                entry.copy(self)
    
    def get_sorted_entries(self, words=None) -> List[Entry]:
        if (words is None):
            words = self.words

        match (self.sort_type):
            case SortingTypes.AddingTime:
                arr = words.order_by("-adding_time")
            case SortingTypes.AddingTimeReverse:
                arr = words.order_by("-adding_time")[::-1]
            case SortingTypes.LeastQuased:
                arr = words.annotate(
                    num_difference=ExpressionWrapper(
                        F('guessed_num') - F('guessing_attempts'), 
                        output_field=IntegerField()
                    )
                ).order_by('num_difference')
        
        return arr
    
    def make_search(self, search, searchType=SearchTypes.Word):
        if not isinstance(searchType, SearchTypes):
            searchType = SearchTypes(searchType)

        match (searchType):
            case SearchTypes.Word:
                words = self.words.filter(word__startswith=search)
            case SearchTypes.Translates:
                words = self.words.filter(
                    Q(translates__translate1__startswith=search) |
                    Q(translates__translate2__startswith=search) |
                    Q(translates__translate3__startswith=search)
                ).distinct()
            case SearchTypes.Notes:
                words = self.words.filter(notes__startswith=search)
            case SearchTypes.AddingTime:
                words = self.words.filter(adding_time__startswith=search)
            case _:
                raise Exception(f"The sended searchType {searchType} is not present in SearchTypes")
        return words

    def get_last_page_index(self, words_per_page: int):
        return int(self.words.count() / words_per_page) * words_per_page
    
    def update_data(self, newData: dict) -> None: # пріколи з нейм і його унікальністю
        if ((name := newData.get('name')) and name != self.name):
            try:
                Dictionary.get(self.group.user, name, False)
                raise Exception("Dictionary with the same name already exists")
            except ObjectDoesNotExist:
                self.name = name

        props_types = [['is_default', bool], ['words_per_page', int], ['sort_type', int]]
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


class TranslationVarians(models.Model):
    translate1 = models.CharField(max_length=64, default='')
    translate2 = models.CharField(max_length=64, null=True, default=None)
    translate3 = models.CharField(max_length=64, null=True, default=None)
    
    def set_arr(self, arr):
        print(f"Got arr {arr} with size {len(arr)}")
        if len(arr) > 3 or len(arr) < 1:
            raise IndexError("the arrays length is larger then the slotes count")
        
        if (len(arr) > 0):
            self.translate1 = arr[0]
        if (len(arr) > 1):
            self.translate2 = arr[1]
        if (len(arr) > 2):
            self.translate3 = arr[2]
        self.save()
    
    def get_arr(self):
        return [self.translate1, self.translate2, self.translate3]
    
    def copy(self):
        return TranslationVarians.objects.create(
            translate1=self.translate1,
            translate2=self.translate2,
            translate3=self.translate3
        )


class Entry(models.Model):
    word  = models.CharField(max_length = MAX_WORD_LENGTH)
    translates = models.OneToOneField(TranslationVarians, on_delete=models.CASCADE)
    notes = models.CharField(max_length=128, null=True, default=None)
    adding_time  = models.DateField(auto_now_add=True)
    guessed_num = models.IntegerField(default=0)
    guessing_attempts = models.IntegerField(default=0)
    dictionary = models.ForeignKey(Dictionary, on_delete=models.CASCADE, related_name='words')

    @staticmethod
    def get(user, dict_name, id):
        try:
            dictionary = Dictionary.get(user, dict_name, False)
            entry: Entry = Entry.objects.filter(dictionary=dictionary).get(id=id)
            return entry
        except ObjectDoesNotExist:
            raise ObjectDoesNotExist('No dictionary or entry was found')
    
    def copy(self, dictionary: Dictionary):
        dictionary.words_count+=1
        dictionary.save()
        return Entry.create(
            word=self.word, 
            translates=self.translates.copy(),
            notes=self.notes,
            adding_time=self.adding_time,
            guessed_num=self.guessed_num,
            guessing_attempts=self.guessing_attempts,
            dictionary=dictionary
        )
    
    def delete(self, *args, **kwargs) -> tuple[int, dict[str, int]]:
        self.dictionary.words_count -= 1
        self.dictionary.save()
        return super().delete(*args, **kwargs)

    @classmethod
    def create(cls, word, translates, dictionary, notes=None):
        translation_varians = TranslationVarians()
        translation_varians.set_arr(translates)
        
        return cls.objects.create(
            word=word,
            translates=translation_varians,
            dictionary=dictionary,
            notes=notes
        )