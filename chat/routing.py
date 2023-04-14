from django.urls import path
from .consumers import ChatConsumer

websocket_urlpatterns  = {
    path("chat/<conversation_name>",ChatConsumer.as_asgi()),
}