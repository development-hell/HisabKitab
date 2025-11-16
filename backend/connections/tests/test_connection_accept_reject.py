from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from connections.models import UserConnection
from users.models import User


class UserConnectionActionTests(TestCase):
    """Tests for listing, accepting, and rejecting connections."""

    def setUp(self):
        self.client = APIClient()
        self.user_a = User.objects.create_user(email="kishan.dev@hisabkitab.com", username="kishandev", password="pass123")
        self.user_b = User.objects.create_user(email="yours.dev@hisabkitab.com", username="yoursdev", password="pass123")

        self.token_url = "/api/token/"
        self.connections_url = "/api/connections/"

        token_a = self.client.post(self.token_url, {"email": "kishan.dev@hisabkitab.com", "password": "pass123"}, format="json").data["access"]
        token_b = self.client.post(self.token_url, {"email": "yours.dev@hisabkitab.com", "password": "pass123"}, format="json").data["access"]

        self.auth_headers_a = {"HTTP_AUTHORIZATION": f"Bearer {token_a}"}
        self.auth_headers_b = {"HTTP_AUTHORIZATION": f"Bearer {token_b}"}

    def test_send_and_accept_connection(self):
        """User A (Kishan) sends a request; User B (Yours) accepts it."""
        # A sends
        resp = self.client.post(
            self.connections_url,
            {"receiver": "yoursdev", "message": "hey"},
            format="json",
            **self.auth_headers_a,
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        conn_id = resp.data["connection_id"]

        # B accepts
        resp2 = self.client.post(
            f"{self.connections_url}{conn_id}/accept/",
            format="json",
            **self.auth_headers_b,
        )
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        self.assertEqual(resp2.data["status"], "accepted")

    def test_send_and_reject_connection(self):
        """User A (Kishan) sends a request; User B (Yours) rejects it."""
        # A sends
        resp = self.client.post(
            self.connections_url,
            {"receiver": "yoursdev", "message": "hey"},
            format="json",
            **self.auth_headers_a,
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        conn_id = resp.data["connection_id"]

        # B rejects
        resp2 = self.client.post(
            f"{self.connections_url}{conn_id}/reject/",
            format="json",
            **self.auth_headers_b,
        )
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        self.assertEqual(resp2.data["status"], "rejected")

    def test_only_receiver_can_accept_or_reject(self):
        """Ensure requester (Kishan) cannot accept or reject."""
        conn = UserConnection.objects.create(requester=self.user_a, receiver=self.user_b, status="pending")

        # A (Kishan) tries to accept
        resp = self.client.post(
            f"{self.connections_url}{conn.connection_id}/accept/",
            format="json",
            **self.auth_headers_a,
        )
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

        # A (Kishan) tries to reject
        resp2 = self.client.post(
            f"{self.connections_url}{conn.connection_id}/reject/",
            format="json",
            **self.auth_headers_a,
        )
        self.assertEqual(resp2.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_connections_returns_nested_data(self):
        """
        Tests that the LIST endpoint returns the new nested
        serializer data.
        """
        UserConnection.objects.create(requester=self.user_a, receiver=self.user_b, status="accepted")

        self.client.credentials(**self.auth_headers_a)  # Auth as Kishan
        resp = self.client.get(self.connections_url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 1)

        # Check for nested user data
        conn = resp.data[0]
        self.assertIn("requester", conn)
        self.assertIn("receiver", conn)
        self.assertEqual(conn["requester"]["username"], "kishandev")
        self.assertEqual(conn["receiver"]["username"], "yoursdev")
