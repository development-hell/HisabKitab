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
        read_only_fields = ["user_id", "is_active", "role", "email"]
        extra_kwargs = {
            "password": {"write_only": True},
            "username": {"validators": []},
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
        validated_data.pop("email", None)
        # Properly hash password before saving
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.is_active = True
        user.save()
        return user
