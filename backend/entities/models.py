from django.db import models
from django.conf import settings

class Entity(models.Model):
    ENTITY_TYPES = [
        ('ACCOUNT', 'Account'),
        ('EXTERNAL_PAYEE', 'External Payee'),
        ('CATEGORY', 'Category'),
        ('WALLET', 'Digital Wallet'),
        ('SYSTEM', 'System'),
    ]

    entity_id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='entities'
    )
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=ENTITY_TYPES)
    current_balance = models.DecimalField(max_digits=19, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"

    class Meta:
        verbose_name_plural = "Entities"
