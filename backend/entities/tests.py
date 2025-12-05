from rest_framework.test import APITestCase
from users.models import User
from entities.models import Entity

class EntityTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='password123'
        )
        self.client.force_authenticate(user=self.user)

    def test_create_entity_with_balance(self):
        """
        Ensure we can create an entity with an initial balance.
        """
        entity = Entity.objects.create(
            owner=self.user,
            name="My Bank",
            type="ACCOUNT",
            current_balance=1000.50
        )
        self.assertEqual(entity.current_balance, 1000.50)
        
        # Verify default is 0
        entity_default = Entity.objects.create(
            owner=self.user,
            name="Empty Wallet",
            type="WALLET"
        )
        self.assertEqual(entity_default.current_balance, 0.00)
