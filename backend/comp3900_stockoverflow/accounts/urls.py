from django.urls import path
from . import views



urlpatterns = [
    path('',views.register, name = 'register'),
    path('add', views.add, name = 'add')
]