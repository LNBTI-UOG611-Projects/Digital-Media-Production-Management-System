from django.db import models
from core.models import TimeStampedModel


class Invoice(TimeStampedModel):
    project = models.ForeignKey("projects.Project", on_delete=models.PROTECT, related_name="invoices")
    quotation = models.ForeignKey("sales.Quotation", null=True, blank=True, on_delete=models.SET_NULL)
    type = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=30, default="unpaid")


class Payment(TimeStampedModel):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    method = models.CharField(max_length=30)
    slip_link = models.TextField(null=True, blank=True)
    verified = models.BooleanField(default=False)


class Refund(TimeStampedModel):
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, related_name="refund")
    amount = models.DecimalField(max_digits=12, decimal_places=2)


class Expense(TimeStampedModel):
    project = models.ForeignKey("projects.Project", on_delete=models.CASCADE, related_name="expenses")
    category = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)


class FreelancerInvoice(TimeStampedModel):
    assignment = models.ForeignKey("assignments.Assignment", on_delete=models.PROTECT, related_name="freelancer_invoices")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, default="submitted")


class Payout(TimeStampedModel):
    freelancer_invoice = models.OneToOneField(FreelancerInvoice, on_delete=models.CASCADE, related_name="payout")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    paid_on = models.DateField()
