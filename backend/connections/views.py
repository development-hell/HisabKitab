from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import UserConnection
from .serializers import UserConnectionSerializer
from django.db import models
from users.models import User

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

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated, IsInvolvedPermission])
    def accept(self, request, pk=None):
        conn = self.get_object()
        # only receiver should accept
        if conn.receiver != request.user:
            return Response({"detail":"Only the receiver can accept the request."}, status=status.HTTP_403_FORBIDDEN)
        if conn.status != UserConnection.STATUS_PENDING:
            return Response({"detail":"Connection not pending."}, status=status.HTTP_400_BAD_REQUEST)
        conn.status = UserConnection.STATUS_ACCEPTED
        conn.save()
        serializer = self.get_serializer(conn)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated, IsInvolvedPermission])
    def reject(self, request, pk=None):
        conn = self.get_object()
        if conn.receiver != request.user:
            return Response({"detail":"Only the receiver can reject the request."}, status=status.HTTP_403_FORBIDDEN)
        if conn.status != UserConnection.STATUS_PENDING:
            return Response({"detail":"Connection not pending."}, status=status.HTTP_400_BAD_REQUEST)
        conn.status = UserConnection.STATUS_REJECTED
        conn.save()
        serializer = self.get_serializer(conn)
        return Response(serializer.data)
