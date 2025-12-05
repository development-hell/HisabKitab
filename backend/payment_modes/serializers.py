from rest_framework import serializers
from .models import Payment_Mode, SupportedApp
from entities.models import Entity

class SupportedAppSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportedApp
        fields = ['key', 'name', 'supports_wallet', 'icon']

class PaymentModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment_Mode
        fields = ['mode_id', 'name', 'app_key', 'linked_entity', 'created_at', 'updated_at']
        read_only_fields = ['mode_id', 'created_at', 'updated_at']

    def validate_linked_entity(self, value):
        user = self.context['request'].user
        if value.owner != user:
            raise serializers.ValidationError("You can only link payment modes to your own entities.")
        return value

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)
