from django.conf import settings
from django.db import models
from core.models import TimeStampedModel


class EmployeeProfile(TimeStampedModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="employee_profile")
    manager = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="managed_employees")
    job_title = models.CharField(max_length=255)
    day_rate = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)


class LeaveRequest(TimeStampedModel):
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name="leave_requests")
    from_date = models.DateField()
    to_date = models.DateField()
    status = models.CharField(max_length=20, default="pending")


class Timesheet(TimeStampedModel):
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name="timesheets")
    day = models.DateField()
    hours = models.DecimalField(max_digits=5, decimal_places=2)


class AttendanceLog(TimeStampedModel):
    assignment = models.ForeignKey("assignments.Assignment", on_delete=models.CASCADE, related_name="attendance_logs")
    check_in = models.DateTimeField()
