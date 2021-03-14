from django.db import models

# Create your models here.
class user(models.Model):
    user_id = models.IntegerField(verbose_name = 'User ID', primary_key=True)