from django.urls import path, re_path
from django.views.decorators.csrf import csrf_exempt
from rest_framework_jwt.views import obtain_jwt_token
from . import views

urlpatterns = [
    re_path(r'register/', csrf_exempt(views.register)),
    re_path(r'login/', csrf_exempt(obtain_jwt_token)),
    path('add', views.add, name='add')
]
