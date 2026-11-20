from django.conf import settings
from django.db import models
from core.models import TimeStampedModel


class Rating(TimeStampedModel):
    assignment = models.ForeignKey("assignments.Assignment", on_delete=models.CASCADE, related_name="ratings")
    rater = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="ratings_given")
    rater_type = models.CharField(max_length=20)  # manager, client, peer
    overall = models.DecimalField(max_digits=3, decimal_places=2)
    comment = models.TextField(blank=True)

    class Meta:
        unique_together = ("assignment", "rater")  # one rating per rater per assignment


class RatingScore(TimeStampedModel):
    rating = models.ForeignKey(Rating, on_delete=models.CASCADE, related_name="scores")
    criterion = models.CharField(max_length=100)
    stars = models.PositiveSmallIntegerField()


class PerformanceMetric(TimeStampedModel):
    assignment = models.OneToOneField("assignments.Assignment", on_delete=models.CASCADE, related_name="performance")
    on_time_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    revision_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    objective_score = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
