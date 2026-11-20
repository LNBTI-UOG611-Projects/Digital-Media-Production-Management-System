from django.conf import settings
from django.db import models
from core.models import TimeStampedModel


class FaqArticle(TimeStampedModel):
    question = models.TextField()
    answer = models.TextField()


class ChatSession(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="chat_sessions")
    audience = models.CharField(max_length=20, default="visitor")
    handed_off = models.BooleanField(default=False)


class ChatMessage(TimeStampedModel):
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name="messages")
    faq = models.ForeignKey(FaqArticle, null=True, blank=True, on_delete=models.SET_NULL)
    sender = models.CharField(max_length=20)
    message_text = models.TextField()
