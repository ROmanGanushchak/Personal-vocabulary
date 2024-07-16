from rest_framework.views       import APIView
from rest_framework.response    import Response
from rest_framework             import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

from django.shortcuts       import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist

from .models                    import WordPair, Dictionary
from .serializers               import WordPairSerializer, DictionarySerializer

class WordPairView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, id: str, ignore_copy: bool) -> Response:
        try:
            native_word = request.data['native_word']
            learned_word = request.data['learned_word']
        except KeyError:
            return Response({'detail': 'Not all data were specified'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            dictionary = Dictionary.objects.get(id=id)
            if (dictionary.user != request.user.profile):
                raise ObjectDoesNotExist
        except ObjectDoesNotExist:
            return Response({'detail': 'Dictionary with specified id doesnt exists'}, status=status.HTTP_404_NOT_FOUND)

        words = dictionary.add_word_pair(ignore_copy, native_word, learned_word)
        if (words is not None):
            return Response({'copys': words})
        return Response({'message': 'data added'})

    def get(self, request, id) -> Response: # start
        try:
            start: int = request.data['start']
            dictionary = Dictionary.objects.filter(user=request.user.profile).get(id=id)
        except ObjectDoesNotExist:
            return Response({"details": "no such dictinary created"}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            return Response({"details": "no start field sended"}, status=status.HTTP_400_BAD_REQUEST)
        
        pairs = dictionary.words.order_by("-adding_time")
        if (start >= len(pairs) or start < 0):
            return Response({"details": "uncorect index of word_pair"}, status=status.HTTP_400_BAD_REQUEST) 

        words = pairs[start : min(len(pairs), start+request.user.profile.words_per_page)]
        serializer = WordPairSerializer(words, many=True)
        return Response({"words": serializer.data})


class DictionaryView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = DictionarySerializer(data=request.data)
        if serializer.is_valid():
            dict = Dictionary.objects.create(learned_language=request.data['learned_language'], user=request.user.profile)
            serializer = DictionarySerializer(instance=dict)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, id: int) -> Response:
        try:
            dictionary = Dictionary.objects.get(id=id)
            if (dictionary.user != request.user.profiler):
                raise ObjectDoesNotExist
        except ObjectDoesNotExist:
            return Response({'detail': 'Dictionary with that id does not exists or belongs to other user'}, status=status.HTTP_404_NOT_FOUND)

        serializer = DictionarySerializer(instance=dictionary)
        return Response({"dictionary": serializer.data})