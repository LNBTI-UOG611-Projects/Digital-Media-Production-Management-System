from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from core.models import TimeStampedModel


class Client(TimeStampedModel):
    """A customer: either an individual person or a company."""

    class Type(models.TextChoices):
        INDIVIDUAL = "individual"
        COMPANY = "company"

    client_type = models.CharField(max_length=20, choices=Type.choices, default=Type.INDIVIDUAL)
    company_name = models.CharField(max_length=255, blank=True)  # only used for companies
    address = models.TextField(blank=True)
    loyalty_tier = models.CharField(max_length=20, default="bronze")

    @property
    def display_name(self):
        """Company name, or the main contact's name for an individual."""
        if self.company_name:
            return self.company_name
        contact = self.contacts.select_related("user").first() if self.pk else None
        return (contact.user.get_full_name() or contact.user.username) if contact else f"Client #{self.pk}"

    def clean(self):
        if self.client_type == self.Type.COMPANY and not self.company_name.strip():
            raise ValidationError({"company_name": "A company needs a company name."})

    def __str__(self):
        return self.display_name


class ClientContact(TimeStampedModel):
    """The person(s) who log in for a client. An individual client has exactly one contact."""
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="contacts")
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="client_contact")
    position = models.CharField(max_length=255, blank=True)
