from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User, auth
from rest_framework.decorators import api_view
from .serializers import RegisterSerializer
from rest_framework.response import Response
from rest_framework import status


# Create your views here.
@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def add(request):
    # val1 = request.GET['num1']
    # val2 = request.GET['num2']
    # res = int(val1) + int(val2)
    return render(request, 'home.html', {'result': 3})
