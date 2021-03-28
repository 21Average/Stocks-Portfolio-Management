from django.urls import path, re_path
from rest_framework_jwt.views import obtain_jwt_token
from .views import Register, UserDetail
from . import views

urlpatterns = [
    re_path(r'register/', Register.as_view()),
    # Temporarily disabled login/ to access django admin page. Need to enable when using frontend
    # re_path(r'login/', obtain_jwt_token),
    re_path(r'profile/', UserDetail.as_view()),
    path('add', views.add, name='add')
]
