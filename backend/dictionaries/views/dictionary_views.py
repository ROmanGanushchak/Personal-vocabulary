from rest_framework.views       import APIView
from rest_framework.response    import Response
from rest_framework             import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

from django.shortcuts       import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist

from ..models                    import WordPair, Dictionary, DictionaryGroup
from ..serializers               import WordPairSerializer, DictionarySerializer
from authentication.decorators  import authorized
from accounts.models            import UserProfile


class GetLastWordPairIndex(APIView):
    @authorized
    def post(self, request, name):
        user: UserProfile = request.user.profile
        try:
            dictionary: Dictionary = Dictionary.get(user, name, False)
        except ObjectDoesNotExist:
            return Response({'detail': 'No dictionary found with specified name'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            count = request.data['count']
        except KeyError:
            count = user.words_per_page
        print(f"Count -> {count}, words in dict -> ${dictionary.words_count}")

        rezult: int = min(int((dictionary.words_count-1) / count) * count, dictionary.words_count-1)
        return Response(rezult)


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