from datetime import timedelta

from django.core.exceptions import ValidationError
from django.db import models
from core.models import TimeStampedModel

UNAVAILABLE = ("maintenance", "damaged", "retired")


class EquipmentKit(TimeStampedModel):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Equipment(TimeStampedModel):
    kit = models.ForeignKey(EquipmentKit, null=True, blank=True, on_delete=models.SET_NULL, related_name="items")
    serial_no = models.CharField(max_length=100, unique=True)
    qr_code = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=100)  # camera, lens, lighting, audio, drone, accessory
    status = models.CharField(max_length=20, default="available")
    daily_rate = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.category} {self.serial_no}"


class EquipmentBooking(TimeStampedModel):
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name="bookings")
    project = models.ForeignKey("projects.Project", on_delete=models.CASCADE, related_name="equipment_bookings")
    from_time = models.DateTimeField()
    to_time = models.DateTimeField()
    status = models.CharField(max_length=20, default="reserved")  # reserved, checked_out, returned

    def clean(self):
        from apps.accounts.models import Certification
        from apps.assignments.models import Assignment

        errors: dict[str, list[str]] = {}
        if self.from_time >= self.to_time:
            errors.setdefault("to_time", []).append("The end must be after the start.")
        eq = self.equipment
        if eq.status in UNAVAILABLE:
            errors.setdefault("equipment", []).append(f"This item is {eq.status} and cannot be booked.")
        clash = (
            EquipmentBooking.objects.filter(equipment=eq, status__in=("reserved", "checked_out"), from_time__lt=self.to_time, to_time__gt=self.from_time)
            .exclude(pk=self.pk)
        )
        if clash.exists():
            errors.setdefault("from_time", []).append("This item is already booked for part of this time.")
        if eq.category.lower() == "drone":
            crew = Assignment.objects.filter(project_role__project=self.project).values_list("user_id", flat=True)
            licensed = Certification.objects.filter(user_id__in=list(crew), name__icontains="drone", expiry_date__gte=self.from_time.date()).exists()
            if not licensed:
                errors.setdefault("equipment", []).append("A drone needs a crew member with a valid drone licence on this project.")
        if errors:
            raise ValidationError(errors)


class CheckoutLog(TimeStampedModel):
    booking = models.ForeignKey(EquipmentBooking, on_delete=models.CASCADE, related_name="checkout_logs")
    out_at = models.DateTimeField()
    in_at = models.DateTimeField(null=True, blank=True)
    condition_in = models.TextField(blank=True)


class MaintenanceLog(TimeStampedModel):
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name="maintenance_logs")
    service_date = models.DateField()
    notes = models.TextField(blank=True)


class Studio(TimeStampedModel):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50)  # voice, photo
    hourly_rate = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return self.name


class StudioBooking(TimeStampedModel):
    studio = models.ForeignKey(Studio, on_delete=models.CASCADE, related_name="bookings")
    project = models.ForeignKey("projects.Project", on_delete=models.CASCADE, related_name="studio_bookings")
    from_time = models.DateTimeField()
    to_time = models.DateTimeField()
    buffer_mins = models.PositiveIntegerField(default=30)

    def clean(self):
        if self.from_time >= self.to_time:
            raise ValidationError({"to_time": "The end must be after the start."})
        gap = timedelta(minutes=self.buffer_mins)
        clash = StudioBooking.objects.filter(studio=self.studio, from_time__lt=self.to_time + gap, to_time__gt=self.from_time - gap).exclude(pk=self.pk)
        if clash.exists():
            raise ValidationError({"from_time": "The studio is booked at this time (including setup and teardown time)."})
