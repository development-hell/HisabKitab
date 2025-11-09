from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from connections.models import UserConnection


class UserConnectionTests(TestCase):
    """Full workflow test for user connections: send, list, accept, reject."""

    def setUp(self):
        self.client = APIClient()

        # Create two test users
        self.user_a = User.objects.create_user(
            email="a@example.com", username="auser", password="pass123"
        )
        self.user_b = User.objects.create_user(
            email="b@example.com", username="buser", password="pass123"
        )

        # Endpoints
        self.token_url = "/api/token/"
        self.connections_url = "/api/connections/"

        # Get JWT tokens for both users
        token_a_resp = self.client.post(
            self.token_url,
            {"email": "a@example.com", "password": "pass123"},
            format="json",
        )
        token_b_resp = self.client.post(
            self.token_url,
            {"email": "b@example.com", "password": "pass123"},
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

    def test_send_connection_request(self):
        """A sends a connection request to B."""
        self.auth_as("a")
        resp = self.client.post(
            self.connections_url,
            {"receiver": self.user_b.user_id, "message": "Hey, let's connect!"},
            format="json",
        )

        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["status"], "pending")
        self.assertEqual(resp.data["requester"], self.user_a.user_id)
        self.assertEqual(resp.data["receiver"], self.user_b.user_id)
        self.assertTrue(
            UserConnection.objects.filter(
                requester=self.user_a, receiver=self.user_b
            ).exists()
        )

    def test_list_connections(self):
        """List connections and filter by status."""
        # Setup sample connections
        UserConnection.objects.create(
            requester=self.user_a, receiver=self.user_b, status="pending"
        )
        UserConnection.objects.create(
            requester=self.user_b, receiver=self.user_a, status="accepted"
        )

        self.auth_as("a")
        resp = self.client.get(self.connections_url)

        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(resp.data), 2)
        statuses = {conn["status"] for conn in resp.data}
        self.assertIn("pending", statuses)
        self.assertIn("accepted", statuses)

    def test_unauthorized_access(self):
        """Ensure unauthenticated users cannot access connection APIs."""
        self.client.credentials()  # remove token
        resp = self.client.get(self.connections_url)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
