"""Load the demo data: python manage.py seed_demo [--reset]

Reads core/seed/seed_data.json (one list of rows per table, in dependency order).
Demo users get the password "Lova@1234".
"""
import json
from pathlib import Path

from django.apps import apps
from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand
from django.core.management.color import no_style
from django.db import connection, transaction

DATA = Path(__file__).resolve().parents[2] / "seed" / "seed_data.json"
DEMO_PASSWORD = "Lova@1234"
ROLES = {1: "owner", 2: "manager", 3: "employee", 4: "freelancer", 5: "client"}

# table name in the seed file -> "app_label.Model"
MODELS = {
    "users": "accounts.User", "skill": "accounts.Skill", "user_skill": "accounts.UserSkill",
    "certification": "accounts.Certification", "client": "clients.Client", "client_contact": "clients.ClientContact",
    "employee_profile": "employees.EmployeeProfile", "leave_request": "employees.LeaveRequest",
    "timesheet": "employees.Timesheet", "attendance_log": "employees.AttendanceLog",
    "freelancer_profile": "freelancers.FreelancerProfile", "portfolio_item": "freelancers.PortfolioItem",
    "portfolio_review": "freelancers.PortfolioReview", "open_role": "freelancers.OpenRole",
    "job_application": "freelancers.JobApplication", "application_portfolio": "freelancers.ApplicationPortfolio",
    "invitation": "freelancers.Invitation", "enquiry": "sales.Enquiry", "package": "sales.Package",
    "addon": "sales.AddOn", "quotation": "sales.Quotation", "quotation_item": "sales.QuotationItem",
    "project_template": "projects.ProjectTemplate", "project": "projects.Project",
    "project_role": "projects.ProjectRole", "call_sheet": "projects.CallSheet",
    "project_comment": "projects.ProjectComment", "assignment": "assignments.Assignment",
    "task": "assignments.Task", "availability": "scheduling.Availability", "rating": "ratings.Rating",
    "rating_score": "ratings.RatingScore", "performance_metric": "ratings.PerformanceMetric",
    "equipment_kit": "resources.EquipmentKit", "equipment": "resources.Equipment",
    "equipment_booking": "resources.EquipmentBooking", "checkout_log": "resources.CheckoutLog",
    "maintenance_log": "resources.MaintenanceLog", "studio": "resources.Studio",
    "studio_booking": "resources.StudioBooking", "deliverable": "deliverables.Deliverable",
    "deliverable_version": "deliverables.DeliverableVersion", "proof_comment": "deliverables.ProofComment",
    "revision_request": "deliverables.RevisionRequest", "invoice": "finance.Invoice",
    "payment": "finance.Payment", "refund": "finance.Refund", "expense": "finance.Expense",
    "freelancer_invoice": "finance.FreelancerInvoice", "payout": "finance.Payout",
    "faq_article": "chatbot.FaqArticle", "chat_session": "chatbot.ChatSession",
    "chat_message": "chatbot.ChatMessage", "support_ticket": "support.SupportTicket",
    "notification": "notifications.Notification", "audit_log": "reports.AuditLog",
}


class Command(BaseCommand):
    help = "Load demo data into the database."

    def add_arguments(self, parser):
        parser.add_argument("--reset", action="store_true", help="Delete existing data first")
        parser.add_argument("--apps", nargs="+", help="Only load these apps, e.g. --apps accounts clients")

    @transaction.atomic
    def handle(self, *args, **opts):
        data = json.loads(DATA.read_text())
        wanted = set(opts["apps"] or [])
        tables = [t for t in data["order"] if t in MODELS and (not wanted or MODELS[t].split(".")[0] in wanted)]
        if opts["reset"]:
            for t in reversed(tables):
                apps.get_model(MODELS[t]).objects.all().delete()
            self.stdout.write("Existing data deleted.")
        elif "users" in tables and apps.get_model(MODELS["users"]).objects.exists():
            self.stderr.write("Database already has users. Use --reset to reload.")
            return
        hashed = make_password(DEMO_PASSWORD)
        total = 0
        for t in tables:
            model = apps.get_model(MODELS[t])
            objs = []
            for i, row in enumerate(data["tables"][t], start=1):
                row = dict(row)
                row.setdefault("id", i)
                # a column named like a relation (e.g. submitted_by) must be set through its _id attribute
                for key in list(row):
                    try:
                        field = model._meta.get_field(key)
                    except Exception:
                        continue
                    if field.is_relation and field.name == key:
                        row[key + "_id"] = row.pop(key)
                if t == "users":
                    first, _, last = row.pop("name").partition(" ")
                    role = ROLES[row.pop("role_id")]
                    row.pop("password_hash", None)
                    email = row["email"]
                    row.update(username=email.split("@")[0], first_name=first, last_name=last,
                               role=role, password=hashed, is_active=True,
                               is_staff=role in ("owner", "manager"), is_superuser=role == "owner")
                objs.append(model(**row))
            model.objects.bulk_create(objs)
            total += len(objs)
        # ids were set explicitly, so move the database sequences forward
        statements = connection.ops.sequence_reset_sql(no_style(), [apps.get_model(MODELS[t]) for t in tables])
        with connection.cursor() as cur:
            for s in statements:
                cur.execute(s)
        self.stdout.write(self.style.SUCCESS(f"Loaded {total} rows into {len(tables)} tables."))
        self.stdout.write(f"Demo password for all users: {DEMO_PASSWORD}")
