from django.urls import path
from .views import create_vendor_profile

urlpatterns = [
    path('create/', create_vendor_profile),
]