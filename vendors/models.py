from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class VendorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    business_name = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=15)
    approved = models.BooleanField(default=False)

    def __str__(self):
        return self.business_name