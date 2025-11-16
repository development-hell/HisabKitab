from rest_framework import serializers

from .models import User


class NestedUserSerializer(serializers.ModelSerializer):
    """
    A lightweight serializer for displaying user info in nested lists,
    e.g., in the connections list.
    """

    class Meta:
        model = User
        fields = ["user_id", "username", "first_name", "last_name", "profile_image"]
        read_only_fields = fields


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["user_id", "email", "username", "first_name", "last_name", "phone_number", "profile_image", "is_active", "role", "password"]
        read_only_fields = ["user_id", "is_active", "role"]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    profile_image = serializers.ImageField(required=False, allow_null=True)

    def validate_username(self, value):
        """Allow updating existing username, but prevent duplicates."""
        user = self.instance
        if user and user.username == value:
            return value
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
