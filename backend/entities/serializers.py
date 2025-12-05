from rest_framework import serializers
from .models import Entity

class EntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entity
        fields = ['entity_id', 'name', 'type', 'current_balance', 'created_at']
        read_only_fields = ['entity_id', 'created_at']

class ChatListItemSerializer(serializers.Serializer):
    """
    A unified serializer for items in the chat list.
    Can represent either a UserConnection (Friend) or an Entity (Contact/Category).
    """
    id = serializers.CharField()
    name = serializers.CharField()
    type = serializers.CharField()
    status = serializers.CharField(required=False, allow_null=True)
    avatar = serializers.CharField(required=False, allow_null=True)
    last_message = serializers.CharField(required=False, allow_null=True)
    updated_at = serializers.DateTimeField()
