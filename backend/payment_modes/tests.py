from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User
from entities.models import Entity
from .models import Payment_Mode
from .constants import SUPPORTED_APPS

class PaymentModeTests(APITestCase):
    def setUp(self):
        # Create User A
        self.user_a = User.objects.create_user(
            username='usera',
            email='usera@example.com',
            password='password123'
        )
        # Create User B
        self.user_b = User.objects.create_user(
            username='userb',
            email='userb@example.com',
            password='password123'
        )
        
        # Create Entity for User A (Bank Account)
        self.entity_a = Entity.objects.create(
            owner=self.user_a,
            name="My Bank",
            type="ACCOUNT"
        )
        
        # Create Entity for User B
        self.entity_b = Entity.objects.create(
            owner=self.user_b,
            name="User B Bank",
            type="ACCOUNT"
        )

        self.client.force_authenticate(user=self.user_a)

    def test_get_options(self):
        """
        Ensure we can retrieve the server-defined list of supported apps.
        """
        url = reverse('payment-mode-options')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(SUPPORTED_APPS))
        self.assertEqual(response.data[0]['key'], SUPPORTED_APPS[0]['key'])

    def test_create_payment_mode(self):
        """
        Ensure we can create a new payment mode linked to an entity.
        """
        url = reverse('payment-mode-list')
        data = {
            'name': 'My PhonePe',
            'app_key': 'phonepe',
            'linked_entity': self.entity_a.entity_id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Payment_Mode.objects.count(), 1)
        self.assertEqual(Payment_Mode.objects.get().owner, self.user_a)

    def test_create_payment_mode_invalid_entity(self):
        """
        Ensure we cannot link a payment mode to another user's entity.
        """
        url = reverse('payment-mode-list')
        data = {
            'name': 'My PhonePe',
            'app_key': 'phonepe',
            'linked_entity': self.entity_b.entity_id # Belongs to User B
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('linked_entity', response.data)

    def test_list_payment_modes(self):
        """
        Ensure we can only see our own payment modes.
        """
        # Create mode for User A
        Payment_Mode.objects.create(
            owner=self.user_a,
            name="User A Mode",
            app_key="gpay",
            linked_entity=self.entity_a
        )
        # Create mode for User B
        Payment_Mode.objects.create(
            owner=self.user_b,
            name="User B Mode",
            app_key="gpay",
            linked_entity=self.entity_b
        )

        url = reverse('payment-mode-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "User A Mode")

    def test_create_wallet_success(self):
        """
        Ensure we can create a wallet for a supported payment mode.
        """
        # 1. Create Payment Mode (PhonePe supports wallet)
        payment_mode = Payment_Mode.objects.create(
            owner=self.user_a,
            name="My PhonePe",
            app_key="phonepe",
            linked_entity=self.entity_a # Linked to Bank initially
        )
        # Unlink it first (logic requires it to be unlinked? No, logic says "already linked" error. 
        # Wait, if I link it to bank, I can't create wallet? 
        # Requirement: "A 'PhonePe Wallet' Entity can only be created and linked to a 'PhonePe App' Payment_Mode."
        # Usually, you create the mode first, then link it. 
        # If I want to create a wallet, I should probably start with an unlinked mode or unlink it.
        # Let's assume we start with a mode linked to nothing or we want to switch it?
        # The code checks `if payment_mode.linked_entity: return Error`.
        # So I must start with an unlinked mode.
        payment_mode.linked_entity = None
        payment_mode.save()

        url = reverse('payment-mode-create-wallet', args=[payment_mode.mode_id])
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify Wallet Entity Created
        payment_mode.refresh_from_db()
        self.assertIsNotNone(payment_mode.linked_entity)
        self.assertEqual(payment_mode.linked_entity.type, "WALLET")
        self.assertEqual(payment_mode.linked_entity.name, "My PhonePe Wallet")
        self.assertEqual(payment_mode.linked_entity.owner, self.user_a)

    def test_create_wallet_not_supported(self):
        """
        Ensure we cannot create a wallet for an unsupported app (e.g. Cash).
        """
        # Create Payment Mode (Cash does not support wallet)
        payment_mode = Payment_Mode.objects.create(
            owner=self.user_a,
            name="My Cash",
            app_key="cash",
            linked_entity=None
        )

        url = reverse('payment-mode-create-wallet', args=[payment_mode.mode_id])
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("does not support wallets", response.data['error'])

    def test_create_wallet_already_linked(self):
        """
        Ensure we cannot create a wallet if the mode is already linked.
        """
        # Create Payment Mode linked to Bank
        payment_mode = Payment_Mode.objects.create(
            owner=self.user_a,
            name="My PhonePe",
            app_key="phonepe",
            linked_entity=self.entity_a
        )

        url = reverse('payment-mode-create-wallet', args=[payment_mode.mode_id])
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("already linked", response.data['error'])
