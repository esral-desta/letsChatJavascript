from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync

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


    def receive_json(self, content, **kwargs):
        message_type = content["type"]
        if message_type == "chat_message":

            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    "type": "chat_message_echo",
                    "name": content["name"],
                    "message": content["message"],
                },
            )
        return super().receive_json(content, **kwargs)

    def chat_message_echo(self, event):
        self.send_json(event)


# a = {'type': 'websocket', 'path': '/',
#  'raw_path': b'/', 'headers': [(b'host', b'127.0.0.1:8000'),
#   (b'user-agent', b'Mozilla/5.0 (X11; Linux x86_64; rv:107.0) Gecko/20100101 Firefox/107.0'),
#    (b'accept', b'*/*'), (b'accept-language', b'en-US,en;q=0.5'), (b'accept-encoding', b'gzip, deflate, br'), (b'sec-websocket-version', b'13'), (b'origin', b'http://localhost:3000'), (b'sec-websocket-extensions', b'permessage-deflate'), (b'sec-websocket-key', b'he578ZpgdSjDbckoobClCg=='), (b'connection', b'keep-alive, Upgrade'), (b'sec-fetch-dest', b'websocket'), (b'sec-fetch-mode', b'websocket'), (b'sec-fetch-site', b'cross-site'), (b'pragma', b'no-cache'), (b'cache-control', b'no-cache'), (b'upgrade', b'websocket')], 'query_string': b'token=Rq2bAW9kqPkmAoWfXJC31OHs9g1QujTwQjUfI4IFKL2EqjS0u_V2wyr0LcHUXaCa', 'client': ['127.0.0.1', 36040], 'server': ['127.0.0.1', 8000], 'subprotocols': [], 'asgi': {'version': '3.0'}, 'token': 'Rq2bAW9kqPkmAoWfXJC31OHs9g1QujTwQjUfI4IFKL2EqjS0u_V2wyr0LcHUXaCa', 
#    'user': <User: esral>, 'path_remaining': '', 'url_route': {'args': (), 'kwargs': {}}}

