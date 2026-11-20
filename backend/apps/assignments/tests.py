from datetime import timedelta

from django.core.exceptions import ValidationError
from django.test import TestCase
from django.utils import timezone

from apps.accounts.models import Certification, User
from apps.clients.models import Client
from apps.assignments.models import Assignment
from apps.projects.models import Project, ProjectRole
from apps.resources.models import Equipment, EquipmentBooking


def make_project(title, large):
    return Project.objects.create(title=title, is_large=large, client=Client.objects.get_or_create(company_name="Test Co")[0])


def make_user(name, role, **kw):
    return User.objects.create_user(username=name, email=f"{name}@x.lk", password="x", role=role, **kw)


class AssignmentRuleTests(TestCase):
    def setUp(self):
        self.start = timezone.now() + timedelta(days=5)
        self.small = make_project("Small", False)
        self.large = make_project("Large", True)
        self.emp = make_user("emp", "employee")
        self.free = make_user("free", "freelancer")

    def assign(self, project, role_type, user, start=None):
        role = ProjectRole.objects.create(project=project, role_type=role_type)
        s = start or self.start
        a = Assignment(project_role=role, user=user, from_time=s, to_time=s + timedelta(hours=8))
        a.full_clean()
        return a

    def test_voice_over_needs_an_employee(self):
        with self.assertRaises(ValidationError):
            self.assign(self.large, "Voice-over Artist", self.free)
        self.assign(self.small, "Voice-over Artist", self.emp)

    def test_presenter_needs_an_employee(self):
        with self.assertRaises(ValidationError):
            self.assign(self.large, "Presenter", self.free)

    def test_freelancer_only_on_large_projects(self):
        with self.assertRaises(ValidationError):
            self.assign(self.small, "Videographer", self.free)
        self.assign(self.large, "Videographer", self.free)

    def test_freelancer_cannot_edit(self):
        with self.assertRaises(ValidationError):
            self.assign(self.large, "Editor", self.free)

    def test_no_double_booking(self):
        self.assign(self.small, "Photographer", self.emp).save()
        with self.assertRaises(ValidationError):
            self.assign(self.large, "Videographer", self.emp, start=self.start + timedelta(hours=2))
        self.assign(self.large, "Videographer", self.emp, start=self.start + timedelta(days=2))

    def test_suspended_user_cannot_be_assigned(self):
        bad = make_user("bad", "employee", status="suspended")
        with self.assertRaises(ValidationError):
            self.assign(self.small, "Photographer", bad)


class EquipmentRuleTests(TestCase):
    def setUp(self):
        self.start = timezone.now() + timedelta(days=5)
        self.project = make_project("P", True)
        self.cam = Equipment.objects.create(serial_no="C1", category="camera")
        self.drone = Equipment.objects.create(serial_no="D1", category="drone")

    def booking(self, eq, start=None):
        s = start or self.start
        b = EquipmentBooking(equipment=eq, project=self.project, from_time=s, to_time=s + timedelta(days=1))
        b.full_clean()
        return b

    def test_no_overlap(self):
        self.booking(self.cam).save()
        with self.assertRaises(ValidationError):
            self.booking(self.cam, self.start + timedelta(hours=3))

    def test_maintenance_item_cannot_be_booked(self):
        self.cam.status = "maintenance"
        self.cam.save()
        with self.assertRaises(ValidationError):
            self.booking(self.cam)

    def test_drone_needs_licensed_pilot(self):
        with self.assertRaises(ValidationError):
            self.booking(self.drone)
        pilot = make_user("pilot", "employee")
        Certification.objects.create(user=pilot, name="Drone Pilot Licence", expiry_date=(self.start + timedelta(days=300)).date())
        role = ProjectRole.objects.create(project=self.project, role_type="Drone Operator")
        Assignment.objects.create(project_role=role, user=pilot, from_time=self.start, to_time=self.start + timedelta(days=1))
        self.booking(self.drone)
