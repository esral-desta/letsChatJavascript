from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from .models import *
class ChatConsumer(JsonWebsocketConsumer):
    def __init__(self,*args, **kwargs):
        super().__init__(*args, **kwargs)
        # self.room_name = None
        self.user = None
        self.conversation_name = None
        self.conversation = None
    
    def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            print("not connected")
            return
        self.accept()        
        print("connected",self.channel_name)
        print("self.scope urlroute",self.scope['url_route'])        
        print("self.scope kwaRGS",self.scope['url_route']['kwargs'])        
        self.conversation_name = f"{self.scope['url_route']['kwargs']['conversation_name']}"
        self.conversation, created = Conversation.objects.get_or_create(name=self.conversation_name)
        async_to_sync(self.channel_layer.group_add)(
            self.conversation_name,
            self.channel_name,
        )
    
    def disconnect(self, code):
        print("disconnected")
        return super().disconnect(code)

    def get_receiver(self):
        usernames = self.conversation_name.split("__")
        for username in usernames:
            if username != self.user.username:
                # This is the receiver
                return User.objects.get(username=username)

    def receive_json(self, content, **kwargs):
        message_type = content["type"]
        if message_type == "chat_message":

            message = Message.objects.create(
                from_user=self.user,
                to_user=self.get_receiver(),
                content=content["message"],
                conversation=self.conversation
            )
            
            async_to_sync(self.channel_layer.group_send)(
                self.conversation_name,
                {
                    "type": "chat_message_echo",
                    "name": content["name"],
                    "message": content["message"],
                },
            )
        
        return super().receive_json(content, **kwargs)

    def chat_message_echo(self, event):
        self.send_json(event)

