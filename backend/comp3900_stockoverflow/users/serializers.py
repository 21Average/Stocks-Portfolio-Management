from rest_framework import serializers
from . import models

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserProfile
        fields = ('user_id', 'username', 'email')

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserProfile
        fields = ('user_id', 'username', 'email', 'password')

    def register(self, validated_data):
        user = User.objects.create_user(validated_data['username'],validated_data['email'],validated_data['password'])
        return user

##class LoginSerializer(serializers.Serializer):
    
