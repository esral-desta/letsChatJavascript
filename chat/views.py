from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Message
from .serilizers import MessageSerializer
# Create your views here.

@api_view(["GET"])
def last_10_messages(request):
    conversation_name =request.GET.get("conversation")
    messages = Message.objects.filter(conversation__name__contains=request.user.username).filter(conversation__name=conversation_name).order_by("-timestamp")
    print("last 10 messages",messages)
    return Response(MessageSerializer(messages,many=True).data)
