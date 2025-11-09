from rest_framework import serializers
from .models import UserConnection
from users.models import User

class UserConnectionSerializer(serializers.ModelSerializer):
    requester = serializers.PrimaryKeyRelatedField(read_only=True)
    receiver = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = UserConnection
        fields = ["connection_id", "requester", "receiver", "status", "message", "created_at", "updated_at"]
        read_only_fields = ["connection_id", "status", "created_at", "updated_at"]
