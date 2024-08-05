from typing import List
from enum import Enum
from rest_framework.views       import APIView
from rest_framework.response    import Response
from rest_framework             import status
from random import randint

from django.shortcuts       import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import F, ExpressionWrapper, IntegerField, Window
from django.db.models.functions import RowNumber

from dictionaries.models import Dictionary, Entry
from .factor import PriorityTypes, getFlashCardBasicFactor
from dictionaries.serializers import WriteEntrySerializer
from authentication.decorators import authorized

class GetFlashCards(APIView):
    @authorized
    def get(self, request, dictName: str, count: int, lastWordIndex: int):
        try:
            dictionary: Dictionary = Dictionary.get(request.user.profile, dictName, False)
        except ObjectDoesNotExist:
            return Response("No such dictionary exists", status=status.HTTP_400_BAD_REQUEST)
        
        row_numbered = dictionary.words.annotate(
            row_num=Window(
                expression=RowNumber(),
                order_by=F('adding_time').asc()
            )
        )

        row_numbered = row_numbered.filter(row_num__lte=lastWordIndex)

        arr = row_numbered.annotate(
            t=ExpressionWrapper(
                F('flashcard_factor') + F('row_num'), 
                output_field=IntegerField()
            )
        ).order_by('-t')

        chosen_elems = []
        i = 0
        while(i < len(arr) and len(chosen_elems) < count):
            if (len(arr) - i <= count - len(chosen_elems) or randint(0, 1)):
                chosen_elems.append(arr[i])
        
        serializer = WriteEntrySerializer(chosen_elems, many=True)
        return Response(serializer.data)

