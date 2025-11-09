from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["user_id", "email", "username", "first_name", "last_name", "phone_number", "is_active", "password"]
        read_only_fields = ["user_id", "is_active"]
        extra_kwargs = {
            "password": {"write_only": True}  # hide password in API responses
        }

    def create(self, validated_data):
        # Properly hash password before saving
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.is_active = True
        user.save()
        return user
