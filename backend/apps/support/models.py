from django.db import models
from core.models import TimeStampedModel


class SupportTicket(TimeStampedModel):
    client = models.ForeignKey("clients.Client", on_delete=models.CASCADE, related_name="tickets")
    project = models.ForeignKey("projects.Project", null=True, blank=True, on_delete=models.SET_NULL, related_name="tickets")
    chat_session = models.OneToOneField("chatbot.ChatSession", null=True, blank=True, on_delete=models.SET_NULL, related_name="ticket")
    subject = models.CharField(max_length=255)
    priority = models.CharField(max_length=20, default="medium")
    status = models.CharField(max_length=20, default="open")
