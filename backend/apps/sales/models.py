from django.db import models
from core.models import TimeStampedModel


class Enquiry(TimeStampedModel):
    client = models.ForeignKey("clients.Client", on_delete=models.CASCADE, related_name="enquiries")
    source = models.CharField(max_length=50, default="website")
    service_type = models.CharField(max_length=100)
    event_date = models.DateField(null=True, blank=True)
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, default="new")


class Package(TimeStampedModel):
    name = models.CharField(max_length=255)
    base_price = models.DecimalField(max_digits=12, decimal_places=2)
    revision_limit = models.PositiveSmallIntegerField(default=2)


class AddOn(TimeStampedModel):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=12, decimal_places=2)


class Quotation(TimeStampedModel):
    enquiry = models.ForeignKey(Enquiry, on_delete=models.CASCADE, related_name="quotations")
    version = models.PositiveSmallIntegerField(default=1)
    expiry = models.DateField(null=True, blank=True)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, default="draft")


class QuotationItem(TimeStampedModel):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name="items")
    package = models.ForeignKey(Package, null=True, blank=True, on_delete=models.PROTECT)
    addon = models.ForeignKey(AddOn, null=True, blank=True, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
