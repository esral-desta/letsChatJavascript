from django.urls import path
from .views import last_10_messages

urlpatterns = [
    path("last10messages",last_10_messages)
]
