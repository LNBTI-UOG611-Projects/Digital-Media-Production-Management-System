from django.apps import apps
from django.contrib import admin

# Show every model of this app in the Django admin.
for model in apps.get_app_config("deliverables").get_models():
    admin.site.register(model)
