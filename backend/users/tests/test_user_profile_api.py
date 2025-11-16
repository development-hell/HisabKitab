from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from users.models import User


class UserProfileTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="kishan.dev@hisabkitab.com", username="kishandev", password="pass123", first_name="Kishan", last_name="Dev"
        )
        token = self.client.post("/api/token/", {"email": "kishan.dev@hisabkitab.com", "password": "pass123"}, format="json").data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_retrieve_profile(self):
        resp = self.client.get("/api/users/me/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["email"], "kishan.dev@hisabkitab.com")
        self.assertEqual(resp.data["first_name"], "Kishan")

    def test_update_profile(self):
        resp = self.client.patch("/api/users/me/", {"first_name": "Kishan-Updated"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["first_name"], "Kishan-Updated")

        # Verify it saved in DB
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "Kishan-Updated")

    def test_list_all_users_is_forbidden(self):
        """
        Tests that the `GET /api/users/` endpoint is secured and does not
        list all users.
        """
        resp = self.client.get("/api/users/")
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(resp.data["detail"], "Listing all users is not permitted.")
