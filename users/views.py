from django.shortcuts import render
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework.decorators import api_view
# Create your views here.

@api_view(["GET"])
def allUsers(requiest):
    users = User.objects.all()
    serilizer = UserSerializer(users,many=True)
    print(users)
    print(serilizer.data)
    return Response(serilizer.data)