from django.db import models
from entities.models import Entity
from payment_modes.models import Payment_Mode

class Transaction(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('REJECTED', 'Rejected'),
    ]

    transaction_id = models.AutoField(primary_key=True)
    payer = models.ForeignKey(
        Entity,
        on_delete=models.CASCADE,
        related_name='outgoing_transactions',
        help_text="The entity sending the money (Source)"
    )
    payee = models.ForeignKey(
        Entity,
        on_delete=models.CASCADE,
        related_name='incoming_transactions',
        help_text="The entity receiving the money (Destination)"
    )
    amount = models.DecimalField(max_digits=19, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    mode = models.ForeignKey(
        Payment_Mode,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Payment mode used (e.g., UPI, Cash)"
    )
    
    category = models.ForeignKey(
        Entity,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='category_transactions',
        limit_choices_to={'type': 'CATEGORY'},
        help_text="Optional category for classification"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.payer} -> {self.payee}: {self.amount} ({self.status})"
