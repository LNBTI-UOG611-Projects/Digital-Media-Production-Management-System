from django.conf import settings
from django.db import models
from core.models import TimeStampedModel


class Deliverable(TimeStampedModel):
    project = models.ForeignKey("projects.Project", on_delete=models.CASCADE, related_name="deliverables")
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50)
    status = models.CharField(max_length=20, default="draft")


class DeliverableVersion(TimeStampedModel):
    deliverable = models.ForeignKey(Deliverable, on_delete=models.CASCADE, related_name="versions")
    submitted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="submitted_versions")
    version_no = models.PositiveSmallIntegerField(default=1)
    proof_link = models.TextField()
    final_link = models.TextField(null=True, blank=True)
    visibility = models.CharField(max_length=20, default="internal")
    link_status = models.CharField(max_length=20, default="ok")


class ProofComment(TimeStampedModel):
    version = models.ForeignKey(DeliverableVersion, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="proof_comments")
    time_stamp = models.CharField(max_length=20, blank=True)
    comment_text = models.TextField()


class RevisionRequest(TimeStampedModel):
    version = models.ForeignKey(DeliverableVersion, on_delete=models.CASCADE, related_name="revision_requests")
    round_no = models.PositiveSmallIntegerField(default=1)
    billable = models.BooleanField(default=False)
