from rest_framework import serializers

from users.models import User
from users.serializers import NestedUserSerializer

from .models import UserConnection


class UserConnectionSerializer(serializers.ModelSerializer):
    """
    Serializer for CREATE/UPDATE actions.
    Uses SlugRelatedField to accept a 'username' string for the receiver.
    """

    requester = serializers.PrimaryKeyRelatedField(read_only=True)
    receiver = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all())

    class Meta:
        model = UserConnection
        fields = ["connection_id", "requester", "receiver", "status", "message", "created_at", "updated_at"]
        read_only_fields = ["connection_id", "status", "created_at", "updated_at"]


class UserConnectionListSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for LIST actions.
    Displays full nested objects for requester and receiver.
    """

    requester = NestedUserSerializer(read_only=True)
    receiver = NestedUserSerializer(read_only=True)

    class Meta:
        model = UserConnection
        fields = ["connection_id", "requester", "receiver", "status", "message", "created_at", "updated_at"]
        read_only_fields = fields
