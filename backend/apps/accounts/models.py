from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from core.models import TimeStampedModel


class User(AbstractUser):
    class Role(models.TextChoices):
        OWNER = "owner"
        MANAGER = "manager"
        EMPLOYEE = "employee"
        FREELANCER = "freelancer"
        CLIENT = "client"

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CLIENT)
    phone = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=20, default="active")

    def __str__(self):
        return self.get_full_name() or self.username


class Skill(TimeStampedModel):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class UserSkill(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user_skills")
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    level = models.PositiveSmallIntegerField(default=1)
    verified = models.BooleanField(default=False)

    class Meta:
        unique_together = ("user", "skill")


class Certification(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="certifications")
    name = models.CharField(max_length=255)
    expiry_date = models.DateField(null=True, blank=True)
