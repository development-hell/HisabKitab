from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from connections.models import UserConnection


class UserConnectionTests(TestCase):
    """Tests for sending, listing, accepting, and rejecting connections."""

    def setUp(self):
        self.client = APIClient()
        self.user_a = User.objects.create_user(
            email="a@example.com", username="auser", password="pass123"
        )
        self.user_b = User.objects.create_user(
            email="b@example.com", username="buser", password="pass123"
        )

        self.token_url = "/api/token/"
        self.connections_url = "/api/connections/"

        token_a = self.client.post(
            self.token_url, {"email": "a@example.com", "password": "pass123"}, format="json"
        ).data["access"]
        token_b = self.client.post(
            self.token_url, {"email": "b@example.com", "password": "pass123"}, format="json"
        ).data["access"]

        self.auth_headers_a = {"HTTP_AUTHORIZATION": f"Bearer {token_a}"}
        self.auth_headers_b = {"HTTP_AUTHORIZATION": f"Bearer {token_b}"}

    def test_send_and_accept_connection(self):
        """User A sends a request; User B accepts it."""
        # A sends
        resp = self.client.post(
            self.connections_url,
            {"receiver": self.user_b.user_id, "message": "hey"},
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
        """User A sends a request; User B rejects it."""
        resp = self.client.post(
            self.connections_url,
            {"receiver": self.user_b.user_id, "message": "hey"},
            format="json",
            **self.auth_headers_a,
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        conn_id = resp.data["connection_id"]

        resp2 = self.client.post(
            f"{self.connections_url}{conn_id}/reject/",
            format="json",
            **self.auth_headers_b,
        )
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        self.assertEqual(resp2.data["status"], "rejected")

    def test_only_receiver_can_accept_or_reject(self):
        """Ensure requester cannot accept or reject."""
        conn = UserConnection.objects.create(
            requester=self.user_a, receiver=self.user_b, status="pending"
        )

        # A tries to accept
        resp = self.client.post(
            f"{self.connections_url}{conn.connection_id}/accept/",
            format="json",
            **self.auth_headers_a,
        )
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

        # A tries to reject
        resp2 = self.client.post(
            f"{self.connections_url}{conn.connection_id}/reject/",
            format="json",
            **self.auth_headers_a,
        )
        self.assertEqual(resp2.status_code, status.HTTP_403_FORBIDDEN)
