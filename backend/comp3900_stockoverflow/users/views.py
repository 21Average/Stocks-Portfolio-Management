from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import UserSerializer
from .serializers import RegisterSerializer
from . import models

class RegisterView(APIView):
    ###serializer_class = RegisterSerializer()
    
    def post(self, request, format='json'):
        serializer = RegisterSerializer()
    

