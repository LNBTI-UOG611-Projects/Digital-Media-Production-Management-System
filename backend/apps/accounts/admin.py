from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.apps import apps as django_apps

from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ("username", "email", "role", "status", "is_active")
    list_filter = ("role", "status", "is_active")
    fieldsets = DjangoUserAdmin.fieldsets + (("Lova", {"fields": ("role", "phone", "status")}),)
    add_fieldsets = DjangoUserAdmin.add_fieldsets + (("Lova", {"fields": ("email", "role", "phone")}),)


for model in django_apps.get_app_config("accounts").get_models():
    if model is not User:
        admin.site.register(model)
