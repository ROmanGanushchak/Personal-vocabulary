from rest_framework.views       import APIView
from rest_framework.response    import Response
from rest_framework             import status

from django.shortcuts       import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist

from ..models                    import Dictionary, Entry
from ..serializers               import WriteEntrySerializer
from authentication.decorators  import authorized, extract_inputs
from accounts.models            import UserProfile


class EntryCreateView(APIView):
    @authorized
    @extract_inputs(['word', 'translates'], ['note'])
    def post(self, request, word, translates, note, name: str, by_lang: int, ignore_copy: int) -> Response:
        try:
            dictionary: Dictionary = Dictionary.get(request.user.profile, name, by_lang)
        except Exception:
            return Response({'detail': 'Dictionary of this type was not created'}, status=status.HTTP_404_NOT_FOUND)

        words = dictionary.add_word_pair(ignore_copy, word, translates, note)
        if (words is not None):
            serializer = WriteEntrySerializer(instance=words, many=True)
            return Response({'copys': serializer.data})
        return Response({'message': 'data added'})


class EntryGetView(APIView):
    @authorized
    @extract_inputs(["start"], ["count", "search"])
    def post(self, request, start: int, count: int|None, search: str|None, name: str, by_lang: int) -> Response: # start
        if (count is None):
            count = request.user.profile.words_per_page
        
        if (start == -1):
            return Response({'words': []})

        try:
            dictionary: Dictionary = Dictionary.get(request.user.profile, name, by_lang)
        except ObjectDoesNotExist:
            return Response({"details": "no such dictinary created"}, status=status.HTTP_400_BAD_REQUEST)

        if (search):
            pairs = dictionary.make_search(search)
        else:
            pairs = dictionary.get_sorted_entries()

        if (start >= len(pairs) or start < 0):
            return Response({"details": "uncorect index of word_pair"}, status=status.HTTP_400_BAD_REQUEST) 

        words = pairs[start : min(len(pairs), start+count)]
        serializer = WriteEntrySerializer(words, many=True)
        return Response({"words": serializer.data})


class EntryDelete(APIView):
    @authorized
    def post(self, request, name: str, id: int):
        try:
            entry: Entry = Entry.get(request.user.profile, name, id)
            entry.delete()
        except ObjectDoesNotExist as e:
            return Response({'detail': str(e)}, status=status.HTTP_404_NOT_FOUND)
        return Response('Deleted')


class IncreaseGueasingCount(APIView):
    @authorized
    def post(self, request, name: str, id: int, result: int):
        try:
            entry: Entry = Entry.get(request.user.profile, name, id)
            entry.guessing_attempts += 1
            if (result):
                entry.guessed_num += 1
            entry.save()
        except ObjectDoesNotExist as e:
            return Response({'detail': str(e)}, status=status.HTTP_404_NOT_FOUND)
        return Response('Changed')


class UpdateEntry(APIView):
    @authorized
    @extract_inputs(["id"])
    def post(self, request, id: int):
        pass


class EntryCopyToDifferentDictionary(APIView):
    @authorized
    @extract_inputs(["id", "name", "name_to_add"])
    def post(self, request, id: int, name: str, name_to_add: str):
        try:
            entry: Entry = Entry.get(request.user.profile, name, id)
            dictionary = Dictionary.get(request.user.profile, name_to_add, False)
        except Exception:
            return Response({'detail': "Unable to get word with that id or dictionary"}, status=status.HTTP_404_NOT_FOUND)
        new_entry = Entry.copy(entry, dictionary)
        serializer = WriteEntrySerializer(instance=new_entry)
        return Response(serializer.data)
        