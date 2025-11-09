from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User

class UserProfileTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="me@example.com", username="meuser", password="pass123"
        )
        token = self.client.post(
            "/api/token/", {"email": "me@example.com", "password": "pass123"}, format="json"
        ).data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_retrieve_profile(self):
        resp = self.client.get("/api/users/me/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["email"], "me@example.com")

    def test_update_profile(self):
        resp = self.client.patch("/api/users/me/", {"first_name": "Kishan"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["first_name"], "Kishan")
