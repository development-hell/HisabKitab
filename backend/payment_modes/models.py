from django.db import models
from django.conf import settings
from entities.models import Entity

class SupportedApp(models.Model):
    key = models.CharField(max_length=50, unique=True, help_text="Internal key e.g., 'phonepe'")
    name = models.CharField(max_length=100)
    supports_wallet = models.BooleanField(default=False)
    icon = models.CharField(max_length=255, blank=True, null=True, help_text="URL or path to icon")

    def __str__(self):
        return self.name

class Payment_Mode(models.Model):
    mode_id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payment_modes'
    )
    name = models.CharField(max_length=255)
    app_key = models.CharField(max_length=50)  # e.g., 'phonepe', 'gpay'
    linked_entity = models.ForeignKey(
        Entity,
        on_delete=models.CASCADE,
        related_name='linked_payment_modes',
        help_text="The underlying account (e.g., Bank Account) for this payment mode."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.app_key})"

    class Meta:
        verbose_name = "Payment Mode"
        verbose_name_plural = "Payment Modes"
