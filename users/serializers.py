from django.contrib.auth.models import User

from rest_framework.serializers import ModelSerializer
# USER_SERIALIZER = 'user.serializers.OwnUserSerializer'
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["username","email"]