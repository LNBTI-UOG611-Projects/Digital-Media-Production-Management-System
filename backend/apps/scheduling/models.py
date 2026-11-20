from django.conf import settings
from django.db import models
from core.models import TimeStampedModel


class Availability(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="availability")
    day = models.DateField()
    is_free = models.BooleanField(default=True)
