from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from core.models import TimeStampedModel

# Business rules from the brief
EMPLOYEE_ONLY = ("voice", "present")                    # voice-over and presenting
FREELANCER_OK = ("photo", "video", "drone", "camera")   # freelancers: photo/video only


class Assignment(TimeStampedModel):
    project_role = models.ForeignKey("projects.ProjectRole", on_delete=models.CASCADE, related_name="assignments")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="assignments")
    application = models.ForeignKey("freelancers.JobApplication", null=True, blank=True, on_delete=models.SET_NULL)
    invitation = models.ForeignKey("freelancers.Invitation", null=True, blank=True, on_delete=models.SET_NULL)
    status = models.CharField(max_length=20, default="confirmed")
    from_time = models.DateTimeField()
    to_time = models.DateTimeField()

    def clean(self):
        """Enforce the assignment rules. Call full_clean() before saving from an API view."""
        errors: dict[str, list[str]] = {}
        if self.from_time and self.to_time and self.from_time >= self.to_time:
            errors.setdefault("to_time", []).append("The end must be after the start.")
        role, user = self.project_role, self.user
        rt = role.role_type.lower()
        if any(k in rt for k in EMPLOYEE_ONLY) and user.role != "employee":
            errors.setdefault("user", []).append("Voice-over and presenting roles can only be given to employees.")
        if user.role == "freelancer":
            if not role.project.is_large:
                errors.setdefault("user", []).append("Freelancers can only work on large projects.")
            elif not any(k in rt for k in FREELANCER_OK):
                errors.setdefault("user", []).append("Freelancers can only fill photography or videography roles.")
        if user.status != "active":
            errors.setdefault("user", []).append(f"This person is {user.status} and cannot be assigned.")
        if self.from_time and self.to_time:
            clash = (
                Assignment.objects.filter(user=user, from_time__lt=self.to_time, to_time__gt=self.from_time)
                .exclude(pk=self.pk)
                .exclude(status__in=("cancelled", "declined"))
            )
            if clash.exists():
                errors.setdefault("from_time", []).append("This person is already booked for part of this time.")
        if errors:
            raise ValidationError(errors)


class Task(TimeStampedModel):
    project = models.ForeignKey("projects.Project", on_delete=models.CASCADE, related_name="tasks")
    assignment = models.ForeignKey(Assignment, null=True, blank=True, on_delete=models.SET_NULL, related_name="tasks")
    title = models.CharField(max_length=255)
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, default="todo")
