from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from users.models import User


class UserRegistrationTests(TestCase):
    """Tests user registration (signup) API."""

    def setUp(self):
        self.client = APIClient()
        self.register_url = "/api/users/"
        self.token_url = "/api/token/"

        # Standard Mock User 1
        self.user_1_data = {
            "email": "kishan.dev@hisabkitab.com",
            "username": "kishandev",
            "password": "pass123",
            "first_name": "Kishan",
            "last_name": "Dev",
        }

    def test_user_registration_success(self):
        """Should create a new user and return correct fields."""
        response = self.client.post(self.register_url, self.user_1_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("email", response.data)
        self.assertEqual(response.data["email"], self.user_1_data["email"])
        self.assertIn("username", response.data)
        self.assertEqual(response.data["username"], self.user_1_data["username"])
        self.assertNotIn("password", response.data)  # never expose password
        self.assertTrue(User.objects.filter(email=self.user_1_data["email"]).exists())

        # Verify password is hashed in DB
        user = User.objects.get(email=self.user_1_data["email"])
        self.assertNotEqual(user.password, self.user_1_data["password"])
        self.assertTrue(user.check_password(self.user_1_data["password"]))

    def test_duplicate_email_registration(self):
        """Should reject duplicate email registrations."""
        # Create User 1
        User.objects.create_user(**self.user_1_data)

        # Attempt to create User 2 with User 1's email
        data = {"email": "kishan.dev@hisabkitab.com", "username": "yoursdev", "password": "password123"}
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
        reg_response = self.client.post(self.register_url, self.user_1_data, format="json")
        self.assertEqual(reg_response.status_code, status.HTTP_201_CREATED)

        login_response = self.client.post(
            self.token_url, {"email": self.user_1_data["email"], "password": self.user_1_data["password"]}, format="json"
        )

        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", login_response.data)
