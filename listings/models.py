from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Listing(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
    )

    vendor = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    distance_text = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    payment_screenshot = models.ImageField(upload_to='payments/', null=True, blank=True)
    contact_number = models.CharField(max_length=15, blank=True)

    image1 = models.ImageField(upload_to='listings/', blank=True, null=True)
    image2 = models.ImageField(upload_to='listings/', blank=True, null=True)
    image3 = models.ImageField(upload_to='listings/', blank=True, null=True)
    image4 = models.ImageField(upload_to='listings/', blank=True, null=True)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title