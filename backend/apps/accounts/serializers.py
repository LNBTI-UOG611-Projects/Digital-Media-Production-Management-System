import re

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from apps.clients.models import Client, ClientContact

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "role", "phone", "status")
        read_only_fields = fields


class MeUpdateSerializer(serializers.ModelSerializer):
    """The fields a signed-in user may change about themselves."""

    class Meta:
        model = User
        fields = ("first_name", "last_name", "phone")


class LoginSerializer(TokenObtainPairSerializer):
    """Sign in with a username OR an email address (not case-sensitive)."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["name"] = user.get_full_name()
        return token

    def validate(self, attrs):
        identifier = (attrs.get(self.username_field) or "").strip()
        lookup = {"email__iexact": identifier} if "@" in identifier else {"username__iexact": identifier}
        match = User.objects.filter(**lookup).first()
        if match:
            attrs[self.username_field] = match.get_username()
        data = super().validate(attrs)  # raises 401 for a wrong password
        if self.user.status != "active":
            raise AuthenticationFailed("This account is not active.")
        data["user"] = UserSerializer(self.user).data
        return data


class RegisterSerializer(serializers.Serializer):
    """Client sign-up: creates the User, the Client and the ClientContact together."""

    client_type = serializers.ChoiceField(choices=Client.Type.choices)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    company_name = serializers.CharField(max_length=255, required=False, allow_blank=True, default="")
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True, default="")
    username = serializers.CharField(max_length=30)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    def validate_username(self, value):
        value = value.strip()
        if not re.fullmatch(r"[A-Za-z0-9_.-]{3,30}", value):
            raise serializers.ValidationError("Use 3 to 30 letters, numbers, dots, dashes or underscores.")
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("That username is already taken.")
        return value

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate_password(self, value):
        validate_password(value)  # Django's rules (length, common passwords, numeric only)
        return value

    def validate(self, attrs):
        if attrs["client_type"] == Client.Type.COMPANY and not attrs.get("company_name", "").strip():
            raise serializers.ValidationError({"company_name": "Enter your company or business name."})
        if attrs["client_type"] == Client.Type.INDIVIDUAL:
            attrs["company_name"] = ""
        return attrs

    @transaction.atomic
    def create(self, data):
        user = User.objects.create_user(
            username=data["username"], email=data["email"], password=data["password"],
            first_name=data["first_name"], last_name=data["last_name"], phone=data.get("phone", ""),
            role=User.Role.CLIENT,
        )
        client = Client.objects.create(client_type=data["client_type"], company_name=data["company_name"].strip())
        ClientContact.objects.create(client=client, user=user)
        return user
