from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db import transaction
from .models import Transaction

@receiver(post_save, sender=Transaction)
def update_balance_on_save(sender, instance, created, **kwargs):
    """
    Update Entity balances when a transaction is saved.
    Only affects balances if status is COMPLETED.
    """
    if created and instance.status == 'COMPLETED':
        with transaction.atomic():
            # Deduct from Payer
            instance.payer.current_balance -= instance.amount
            instance.payer.save()
            
            # Add to Payee
            instance.payee.current_balance += instance.amount
            instance.payee.save()

@receiver(post_delete, sender=Transaction)
def update_balance_on_delete(sender, instance, **kwargs):
    """
    Revert balance changes if a COMPLETED transaction is deleted.
    """
    if instance.status == 'COMPLETED':
        with transaction.atomic():
            # Revert Payer (Add back)
            instance.payer.current_balance += instance.amount
            instance.payer.save()
            
            # Revert Payee (Deduct back)
            instance.payee.current_balance -= instance.amount
            instance.payee.save()
