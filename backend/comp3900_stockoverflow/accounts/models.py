from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.contrib.postgres.fields import ArrayField


class CustomUserManager(BaseUserManager):

    def _create_user(self, email, password, first_name="", last_name="", **extra_fields):
        if not email:
            raise ValueError('Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_user(self, email, password=None, **extra_fields):
        return self._create_user(email=email, password=password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self._create_user(email=email, password=password, **extra_fields)


class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True, blank=True, null=True)
    first_name = models.CharField(max_length=254, blank=False)
    last_name = models.CharField(max_length=254, blank=False)
    is_superuser = models.BooleanField(default=False)
    interests = ArrayField(models.CharField(max_length=200), blank=True, null=True)

    USERNAME_FIELD = 'email'  # Default username is now email
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    def __str__(self):
        return self.get_full_name()
