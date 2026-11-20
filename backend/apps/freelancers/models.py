from django.conf import settings
from django.db import models
from core.models import TimeStampedModel


class FreelancerProfile(TimeStampedModel):
    class Tier(models.TextChoices):
        APPLICANT = "applicant"
        PROBATION = "probation"
        APPROVED = "approved"
        PREFERRED = "preferred"
        SUSPENDED = "suspended"
        BLACKLISTED = "blacklisted"

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="freelancer_profile")
    tier = models.CharField(max_length=20, choices=Tier.choices, default=Tier.APPLICANT)
    day_rate = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)


class PortfolioItem(TimeStampedModel):
    freelancer = models.ForeignKey(FreelancerProfile, on_delete=models.CASCADE, related_name="portfolio_items")
    link = models.TextField()
    role_on_item = models.CharField(max_length=255, blank=True)
    tags = models.TextField(blank=True)
    verification = models.CharField(max_length=20, default="unverified")


class PortfolioReview(TimeStampedModel):
    item = models.ForeignKey(PortfolioItem, on_delete=models.CASCADE, related_name="reviews")
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="portfolio_reviews")
    score = models.DecimalField(max_digits=4, decimal_places=2)


class OpenRole(TimeStampedModel):
    project_role = models.OneToOneField("projects.ProjectRole", on_delete=models.CASCADE, related_name="open_role")
    rate_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    rate_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, default="open")


class JobApplication(TimeStampedModel):
    open_role = models.ForeignKey(OpenRole, on_delete=models.CASCADE, related_name="applications")
    freelancer = models.ForeignKey(FreelancerProfile, on_delete=models.CASCADE, related_name="applications")
    proposed_rate = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    match_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, default="submitted")


class ApplicationPortfolio(TimeStampedModel):
    application = models.ForeignKey(JobApplication, on_delete=models.CASCADE, related_name="cited_items")
    item = models.ForeignKey(PortfolioItem, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("application", "item")


class Invitation(TimeStampedModel):
    open_role = models.ForeignKey(OpenRole, on_delete=models.CASCADE, related_name="invitations")
    freelancer = models.ForeignKey(FreelancerProfile, on_delete=models.CASCADE, related_name="invitations")
    expires_at = models.DateTimeField()
    status = models.CharField(max_length=20, default="pending")
