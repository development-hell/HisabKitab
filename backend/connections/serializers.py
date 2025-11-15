from rest_framework import serializers

from users.models import User

from .models import UserConnection


class UserConnectionSerializer(serializers.ModelSerializer):
    requester = serializers.PrimaryKeyRelatedField(read_only=True)
    receiver = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all())

    class Meta:
        model = UserConnection
        fields = ["connection_id", "requester", "receiver", "status", "message", "created_at", "updated_at"]
        read_only_fields = ["connection_id", "status", "created_at", "updated_at"]
