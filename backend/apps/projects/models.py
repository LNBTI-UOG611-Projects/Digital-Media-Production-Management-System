from django.conf import settings
from django.db import models
from core.models import TimeStampedModel


class ProjectTemplate(TimeStampedModel):
    name = models.CharField(max_length=255)


class Project(TimeStampedModel):
    class Stage(models.TextChoices):
        ENQUIRY = "enquiry"
        QUOTED = "quoted"
        CONFIRMED = "confirmed"
        PRE_PRODUCTION = "pre_production"
        PRODUCTION = "production"
        POST_PRODUCTION = "post_production"
        REVIEW = "review"
        DELIVERED = "delivered"
        PAID = "paid"
        CLOSED = "closed"

    quotation = models.OneToOneField("sales.Quotation", null=True, blank=True, on_delete=models.SET_NULL, related_name="project")
    client = models.ForeignKey("clients.Client", on_delete=models.PROTECT, related_name="projects")
    template = models.ForeignKey(ProjectTemplate, null=True, blank=True, on_delete=models.SET_NULL)
    title = models.CharField(max_length=255)
    is_large = models.BooleanField(default=False)
    stage = models.CharField(max_length=20, choices=Stage.choices, default=Stage.ENQUIRY)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title

    def next_stage(self):
        order = [s for s, _ in self.Stage.choices]
        i = order.index(self.stage)
        return order[i + 1] if i + 1 < len(order) else None


class ProjectRole(TimeStampedModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="roles")
    role_type = models.CharField(max_length=100)
    rate = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)


class CallSheet(TimeStampedModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="call_sheets")
    call_time = models.DateTimeField()
    notes = models.TextField(blank=True)


class ProjectComment(TimeStampedModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="project_comments")
    client_visible = models.BooleanField(default=False)
    body = models.TextField()
