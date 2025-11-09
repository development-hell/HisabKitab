from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User

class UserRegistrationTests(TestCase):
    """Tests user registration (signup) API."""

    def setUp(self):
        self.client = APIClient()
        self.register_url = "/api/users/"
        self.token_url = "/api/token/"

    def test_user_registration_success(self):
        """Should create a new user and return correct fields."""
        data = {
            "email": "newuser@example.com",
            "username": "newuser",
            "password": "password123",
            "first_name": "John",
            "last_name": "Doe"
        }
        response = self.client.post(self.register_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("email", response.data)
        self.assertIn("username", response.data)
        self.assertNotIn("password", response.data)  # never expose password
        self.assertTrue(User.objects.filter(email="newuser@example.com").exists())

        # Verify password is hashed in DB
        user = User.objects.get(email="newuser@example.com")
        self.assertNotEqual(user.password, data["password"])
        self.assertTrue(user.check_password(data["password"]))

    def test_duplicate_email_registration(self):
        """Should reject duplicate email registrations."""
        User.objects.create_user(
            email="dup@example.com", username="dupuser", password="password123"
        )

        data = {
            "email": "dup@example.com",
            "username": "anotheruser",
            "password": "password123"
        }
        response = self.client.post(self.register_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_fields(self):
        """Should fail when required fields are missing."""
        data = {
            "email": "",  # Missing username & password
        }
        response = self.client.post(self.register_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)
        self.assertIn("password", response.data)

    def test_login_after_registration(self):
        """User should be able to log in right after registration."""
        reg_data = {
            "email": "quicklogin@example.com",
            "username": "quickuser",
            "password": "password123"
        }
        reg_response = self.client.post(self.register_url, reg_data, format="json")
        self.assertEqual(reg_response.status_code, status.HTTP_201_CREATED)

        login_response = self.client.post(self.token_url, {
            "email": "quicklogin@example.com",
            "password": "password123"
        }, format="json")

        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", login_response.data)
