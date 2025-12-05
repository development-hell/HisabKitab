from rest_framework.test import APITestCase
from users.models import User
from entities.models import Entity
from .models import Transaction
from decimal import Decimal
from django.utils import timezone

class TransactionBalanceTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='password123'
        )
        self.client.force_authenticate(user=self.user)
        
        # Create Payer (Bank Account) with 1000
        self.payer = Entity.objects.create(
            owner=self.user,
            name="My Bank",
            type="ACCOUNT",
            current_balance=Decimal('1000.00')
        )
        
        # Create Payee (Shop) with 0
        self.payee = Entity.objects.create(
            owner=self.user,
            name="Grocery Store",
            type="EXTERNAL_PAYEE",
            current_balance=Decimal('0.00')
        )

    def test_completed_transaction_updates_balance(self):
        """
        Test that creating a COMPLETED transaction updates balances.
        """
        Transaction.objects.create(
            payer=self.payer,
            payee=self.payee,
            amount=Decimal('100.00'),
            date=timezone.now(),
            status='COMPLETED'
        )
        
        self.payer.refresh_from_db()
        self.payee.refresh_from_db()
        
        self.assertEqual(self.payer.current_balance, Decimal('900.00'))
        self.assertEqual(self.payee.current_balance, Decimal('100.00'))

    def test_pending_transaction_does_not_update_balance(self):
        """
        Test that creating a PENDING transaction does NOT update balances.
        """
        Transaction.objects.create(
            payer=self.payer,
            payee=self.payee,
            amount=Decimal('100.00'),
            date=timezone.now(),
            status='PENDING'
        )
        
        self.payer.refresh_from_db()
        self.payee.refresh_from_db()
        
        self.assertEqual(self.payer.current_balance, Decimal('1000.00'))
        self.assertEqual(self.payee.current_balance, Decimal('0.00'))

    def test_delete_completed_transaction_reverts_balance(self):
        """
        Test that deleting a COMPLETED transaction reverts balances.
        """
        tx = Transaction.objects.create(
            payer=self.payer,
            payee=self.payee,
            amount=Decimal('100.00'),
            date=timezone.now(),
            status='COMPLETED'
        )
        
        # Verify initial update
        self.payer.refresh_from_db()
        self.assertEqual(self.payer.current_balance, Decimal('900.00'))
        
        # Delete
        tx.delete()
        
        self.payer.refresh_from_db()
        self.payee.refresh_from_db()
        
        self.assertEqual(self.payer.current_balance, Decimal('1000.00'))
        self.assertEqual(self.payee.current_balance, Decimal('0.00'))
