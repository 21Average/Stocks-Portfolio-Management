from django.urls import path, re_path
from django.views.decorators.csrf import csrf_exempt
from . import views

urlpatterns = [
    re_path(r'register/', csrf_exempt(views.register)),
    path('add', views.add, name='add')
]
