from rest_framework.views       import APIView
from rest_framework.response    import Response
from rest_framework             import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

from django.shortcuts       import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist

from .models                    import WordPair, Dictionary, DictionaryGroup
from .serializers               import WordPairSerializer, DictionarySerializer
from authentication.decorators  import authorized


class WordPairCreateView(APIView):
    @authorized
    def post(self, request, name: str, by_lang: int, ignore_copy: int) -> Response:
        try:
            native_word = request.data['native_word']
            learned_word = request.data['learned_word']
        except KeyError:
            return Response({'detail': 'Not all data were specified'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            dictionary = Dictionary.get(request.user.profile, name, by_lang)
        except Exception:
            return Response({'detail': 'Dictionary of this type was not created'}, status=status.HTTP_404_NOT_FOUND)

        words = dictionary.add_word_pair(ignore_copy, native_word, learned_word)
        if (words is not None):
            serializer = WordPairSerializer(instance=words, many=True)
            return Response({'copys': serializer.data})
        return Response({'message': 'data added'})


class WordPairGetView(APIView):
    @authorized
    def get(self, request, name: str, by_lang: int) -> Response: # start
        try:
            start: int = request.data['start']
            dictionary = Dictionary.get(request.user.profile, name, by_lang)
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


class DictionaryCreateView(APIView):
    @authorized
    def post(self, request, name, lang, is_default):
        try:
            group = DictionaryGroup.objects.get(user=request.user.profile)
            if (is_default):
                try:
                    old_default = Dictionary.get(request.user.profile, lang, True)
                    old_default.is_default = False
                except ObjectDoesNotExist:
                    pass
            
            try:
                Dictionary.objects.get(name=name)
                return Response({'detail': 'Dictionary with that name already exists'}, status=status.HTTP_400_BAD_REQUEST)
            except ObjectDoesNotExist:
                dict = Dictionary.objects.create(language=lang, group=group, name=name, is_default=is_default)
        except ObjectDoesNotExist:
            return Response({'detail': 'The dictionary group was not created for that user'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': f'Dictionary for that language was already created or invalid user was specified{e}'}, status=status.HTTP_409_CONFLICT)
        return Response(DictionarySerializer(instance=dict).data)


class DectionaryGetView(APIView):
    @authorized
    def get(self, request, name: str, searchType: int) -> Response: # searchType - 0 by name, 1 - by lang, 2 - all
        try:
            if (searchType == 2):
                dictionaries = DictionaryGroup.objects.get(user=request.user.profile).dictionaries
                serializer = DictionarySerializer(instance=dictionaries, many=True)
                return Response({"dicts": serializer.data})
            else:
                try:
                    dictionary = Dictionary.get(request.user.profile, name, searchType == 1)
                except ObjectDoesNotExist:
                    return Response({'defail': 'Failed to find dictionary with specified properties'}, status=status.HTTP_404_NOT_FOUND)
            return Response({"dictionary": DictionarySerializer(instance=dictionary).data})
        except Exception as e:
            print(f"Unknown error in DectionaryGetView.get view:\n{e}")
            return Response({'detail': 'Unknown error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DictionaryUpdateView(APIView):
    @authorized
    def post(self, request, name):
        try:
            dictionary: Dictionary = Dictionary.get(request.user.profile, name, False)
        except ObjectDoesNotExist:
            return Response({'detail': 'Dictionary with that name was not found'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            dictionary.update_data(request.data)
        except Exception as e:
            print(e)
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        serializer = DictionarySerializer(instance=dictionary)
        return Response(serializer.data)

class DictionaryDelete(APIView):
    @authorized
    def post(self, request, name):
        try:
            dictionary = Dictionary.get(request.user.profile, name, False)
            dictionary.delete()
        except ObjectDoesNotExist:
            return Response({'detail': 'Dictionary with spesified name was not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response()