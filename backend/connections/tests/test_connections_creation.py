from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from connections.models import UserConnection
from users.models import User


class UserConnectionCreationTests(TestCase):
    """
    Tests for creating connections and handling validation for
    duplicate requests, self-requests, etc.
    """

    def setUp(self):
        self.client = APIClient()

        # Create two test users
        self.user_a = User.objects.create_user(email="kishan.dev@hisabkitab.com", username="kishandev", password="pass123")
        self.user_b = User.objects.create_user(email="yours.dev@hisabkitab.com", username="yoursdev", password="pass123")

        # Endpoints
        self.token_url = "/api/token/"
        self.connections_url = "/api/connections/"

        # Get JWT tokens for both users
        token_a_resp = self.client.post(
            self.token_url,
            {"email": "kishan.dev@hisabkitab.com", "password": "pass123"},
            format="json",
        )
        token_b_resp = self.client.post(
            self.token_url,
            {"email": "yours.dev@hisabkitab.com", "password": "pass123"},
            format="json",
        )

        self.access_a = token_a_resp.data["access"]
        self.access_b = token_b_resp.data["access"]

    # ----------------------------
    # Helper method
    # ----------------------------
    def auth_as(self, user="a"):
        """Shortcut to set Authorization header for given user."""
        token = self.access_a if user == "a" else self.access_b
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    # ----------------------------
    # Tests start here
    # ----------------------------

    def test_send_connection_request_success(self):
        """A (Kishan) sends a connection request to B (Yours) using username."""
        self.auth_as("a")

        resp = self.client.post(
            self.connections_url,
            {"receiver": "yoursdev", "message": "Hey, let's connect!"},
            format="json",
        )

        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["status"], "pending")
        self.assertEqual(resp.data["requester"], self.user_a.user_id)
        self.assertEqual(resp.data["receiver"], "yoursdev")
        self.assertTrue(UserConnection.objects.filter(requester=self.user_a, receiver=self.user_b).exists())

    def test_unauthorized_access(self):
        """Ensure unauthenticated users cannot access connection APIs."""
        self.client.credentials()  # remove token
        resp = self.client.get(self.connections_url)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_send_request_to_self(self):
        """User A (Kishan) cannot send a request to themself."""
        self.auth_as("a")
        resp = self.client.post(
            self.connections_url,
            {"receiver": "kishandev", "message": "Hi me"},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(resp.data["detail"], "You cannot send a connection request to yourself.")

    def test_send_request_to_nonexistent_user(self):
        self.auth_as("a")
        resp = self.client.post(
            self.connections_url,
            {"receiver": "nonexistentuser", "message": "Hello?"},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("does not exist", str(resp.data["receiver"]))

    def test_send_duplicate_request_pending(self):
        UserConnection.objects.create(requester=self.user_a, receiver=self.user_b, status="pending")

        self.auth_as("a")
        resp = self.client.post(
            self.connections_url,
            {"receiver": "yoursdev", "message": "Hello again?"},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(resp.data["detail"], "A connection request is already pending.")

    def test_send_duplicate_request_accepted(self):
        UserConnection.objects.create(requester=self.user_a, receiver=self.user_b, status="accepted")

        self.auth_as("a")
        resp = self.client.post(
            self.connections_url,
            {"receiver": "yoursdev", "message": "Hello again?"},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(resp.data["detail"], "You are already connected with this user.")

    def test_send_request_when_reverse_pending(self):
        UserConnection.objects.create(requester=self.user_b, receiver=self.user_a, status="pending")

        self.auth_as("a")
        resp = self.client.post(
            self.connections_url,
            {"receiver": "yoursdev", "message": "You first!"},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(resp.data["detail"], "This user has already sent you a request.")
