from django.db import models
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import UserConnection
from .serializers import UserConnectionSerializer


class IsInvolvedPermission(permissions.BasePermission):
    """
    Allow only requester or receiver to access/modify the connection.
    """

    def has_object_permission(self, request, view, obj):
        return obj.requester_id == request.user.pk or obj.receiver_id == request.user.pk


class UserConnectionViewSet(viewsets.ModelViewSet):
    queryset = UserConnection.objects.all().order_by("-created_at")
    serializer_class = UserConnectionSerializer
    permission_classes = [permissions.IsAuthenticated, IsInvolvedPermission]

    def get_queryset(self):
        # restrict list to connections where current user is involved
        user = self.request.user
        return UserConnection.objects.filter(models.Q(requester=user) | models.Q(receiver=user)).order_by("-created_at")

    def perform_create(self, serializer):
        # set the requester as current user and initial status pending
        serializer.save(requester=self.request.user, status=UserConnection.STATUS_PENDING)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        # This will raise a "User not found" error if username is invalid
        serializer.is_valid(raise_exception=True)

        requester = request.user
        receiver = serializer.validated_data["receiver"]  # This is now a User object

        if receiver == requester:
            return Response({"detail": "You cannot send a connection request to yourself."}, status=status.HTTP_400_BAD_REQUEST)

        # Check for existing connection (in either direction)
        existing_connection = UserConnection.objects.filter(
            models.Q(requester=requester, receiver=receiver) | models.Q(requester=receiver, receiver=requester)
        ).first()

        if existing_connection:
            if existing_connection.status == "accepted":
                return Response({"detail": "You are already connected with this user."}, status=status.HTTP_400_BAD_REQUEST)
            if existing_connection.status == "pending":
                if existing_connection.requester == requester:
                    return Response({"detail": "A connection request is already pending."}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({"detail": "This user has already sent you a request."}, status=status.HTTP_400_BAD_REQUEST)
            if existing_connection.status == "rejected":
                # We can implement re-request logic later. For now, block.
                return Response({"detail": "A previous connection request was rejected."}, status=status.HTTP_400_BAD_REQUEST)

        # All checks passed, call the original perform_create
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated, IsInvolvedPermission])
    def accept(self, request, pk=None):
        conn = self.get_object()
        # only receiver should accept
        if conn.receiver != request.user:
            return Response({"detail": "Only the receiver can accept the request."}, status=status.HTTP_403_FORBIDDEN)
        if conn.status != UserConnection.STATUS_PENDING:
            return Response({"detail": "Connection not pending."}, status=status.HTTP_400_BAD_REQUEST)
        conn.status = UserConnection.STATUS_ACCEPTED
        conn.save()
        serializer = self.get_serializer(conn)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated, IsInvolvedPermission])
    def reject(self, request, pk=None):
        conn = self.get_object()
        if conn.receiver != request.user:
            return Response({"detail": "Only the receiver can reject the request."}, status=status.HTTP_403_FORBIDDEN)
        if conn.status != UserConnection.STATUS_PENDING:
            return Response({"detail": "Connection not pending."}, status=status.HTTP_400_BAD_REQUEST)
        conn.status = UserConnection.STATUS_REJECTED
        conn.save()
        serializer = self.get_serializer(conn)
        return Response(serializer.data)
