from django.test import TestCase
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate
from rest_framework.views import APIView

from apps.accounts.models import User
from apps.clients.models import Client, ClientContact
from core.permissions import IsManager, IsOwnerOrManager, IsStaffMember, roles


def make(username, role, **kw):
    return User.objects.create_user(username=username, email=f"{username}@lova.lk", password="Lova@1234", role=role, **kw)


class LoginTests(TestCase):
    def setUp(self):
        self.api = APIClient()
        make("dilani", "manager", first_name="Dilani", last_name="Fernando")

    def login(self, identifier, password="Lova@1234"):
        return self.api.post("/api/auth/token/", {"username": identifier, "password": password}, format="json")

    def test_login_with_username(self):
        r = self.login("dilani")
        self.assertEqual(r.status_code, 200)
        self.assertIn("access", r.data)
        self.assertIn("refresh", r.data)
        self.assertEqual(r.data["user"]["role"], "manager")

    def test_login_is_not_case_sensitive_and_accepts_email(self):
        self.assertEqual(self.login("DILANI").status_code, 200)
        self.assertEqual(self.login("Dilani@Lova.lk").status_code, 200)

    def test_wrong_password_is_rejected(self):
        self.assertEqual(self.login("dilani", "nope").status_code, 401)
        self.assertEqual(self.login("nobody").status_code, 401)

    def test_suspended_account_cannot_sign_in(self):
        make("sam", "employee", status="suspended")
        self.assertEqual(self.login("sam").status_code, 401)

    def test_me_returns_role_and_name(self):
        token = self.login("dilani").data["access"]
        r = self.api.get("/api/auth/me/", HTTP_AUTHORIZATION=f"Bearer {token}")
        self.assertEqual(r.status_code, 200)
        self.assertEqual((r.data["role"], r.data["first_name"], r.data["last_name"]), ("manager", "Dilani", "Fernando"))

    def test_me_needs_a_token(self):
        self.assertEqual(self.api.get("/api/auth/me/").status_code, 401)

    def test_me_patch_changes_only_allowed_fields(self):
        token = self.login("dilani").data["access"]
        r = self.api.patch("/api/auth/me/", {"phone": "0771234567", "role": "owner"}, format="json", HTTP_AUTHORIZATION=f"Bearer {token}")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["phone"], "0771234567")
        self.assertEqual(r.data["role"], "manager")  # cannot promote yourself


class RegisterTests(TestCase):
    def setUp(self):
        self.api = APIClient()
        self.data = {"client_type": "individual", "first_name": "Nethmi", "last_name": "R", "company_name": "",
                     "email": "n@example.com", "phone": "", "username": "nethmi", "password": "Str0ng-Pass!9"}

    def post(self, **over):
        return self.api.post("/api/auth/register/", {**self.data, **over}, format="json")

    def test_individual_registration_creates_user_client_and_contact(self):
        r = self.post()
        self.assertEqual(r.status_code, 201)
        user = User.objects.get(username="nethmi")
        self.assertEqual(user.role, "client")
        client = ClientContact.objects.get(user=user).client
        self.assertEqual((client.client_type, client.company_name), ("individual", ""))
        self.assertEqual(self.api.post("/api/auth/token/", {"username": "nethmi", "password": "Str0ng-Pass!9"}, format="json").status_code, 200)

    def test_company_registration_needs_a_company_name(self):
        r = self.post(client_type="company")
        self.assertEqual(r.status_code, 400)
        self.assertIn("company_name", r.data)
        ok = self.post(client_type="company", company_name="Demo Co")
        self.assertEqual(ok.status_code, 201)
        self.assertEqual(Client.objects.get(company_name="Demo Co").client_type, "company")

    def test_duplicates_and_weak_passwords_return_field_errors(self):
        self.post()
        r = self.post(email="other@example.com")
        self.assertIn("username", r.data)
        r = self.post(username="other")
        self.assertIn("email", r.data)
        r = self.post(username="third", email="third@example.com", password="12345678")
        self.assertIn("password", r.data)
        self.assertEqual(Client.objects.count(), 1)  # nothing half-created


class PermissionTests(TestCase):
    def check(self, permission, user):
        class V(APIView):
            permission_classes = [permission]

            def get(self, request):
                return Response("ok")

        request = APIRequestFactory().get("/x")
        if user:
            force_authenticate(request, user=user)
        return V.as_view()(request).status_code

    def test_role_classes(self):
        mgr, emp, cli = make("m", "manager"), make("e", "employee"), make("c", "client")
        self.assertEqual(self.check(IsManager, mgr), 200)
        self.assertEqual(self.check(IsManager, emp), 403)
        self.assertEqual(self.check(IsOwnerOrManager, mgr), 200)
        self.assertEqual(self.check(IsStaffMember, emp), 200)
        self.assertEqual(self.check(IsStaffMember, cli), 403)
        self.assertEqual(self.check(roles("client", "freelancer"), cli), 200)
        self.assertEqual(self.check(IsManager, None), 401)
