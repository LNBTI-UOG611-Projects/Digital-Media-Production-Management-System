from django.conf import settings
from django.db import models
from django.utils import timezone
from core.models import TimeStampedModel


class AuditLog(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL, related_name="audit_logs")
    action = models.CharField(max_length=255)
    entity = models.CharField(max_length=100)
    at_time = models.DateTimeField(default=timezone.now)
