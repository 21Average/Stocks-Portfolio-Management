from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser

class UserProfile(models.Model):
    user_id = models.IntegerField(verbose_name = 'User ID', primary_key=True)
    username = models.CharField(verbose_name='Username', max_length=50, unique=True)
    email = models.EmailField(verbose_name='Email', max_length=254, unique=True)
    password = models.CharField(verbose_name='Password', max_length=50)

    def __str__(self):
        return "{}:{}".format(self.username,self.email)