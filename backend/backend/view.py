from rest_framework.views import APIView
from rest_framework.response import Response

class ConnectionChecker(APIView):
    def post(self, request):
        return Response({'message': 'success access to back'})
    
    def get(self, request):
        return Response({'message': 'success access to back'})