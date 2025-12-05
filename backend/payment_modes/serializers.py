from rest_framework import serializers
from .models import Payment_Mode, SupportedApp
from entities.models import Entity

class SupportedAppSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportedApp
        fields = ['key', 'name', 'supports_wallet', 'icon']

class PaymentModeSerializer(serializers.ModelSerializer):
    supports_wallet = serializers.SerializerMethodField()

    class Meta:
        model = Payment_Mode
        fields = ['mode_id', 'name', 'app_key', 'linked_entity', 'supports_wallet', 'created_at', 'updated_at']
        read_only_fields = ['mode_id', 'created_at', 'updated_at']

    def get_supports_wallet(self, obj):
        try:
            app = SupportedApp.objects.get(key=obj.app_key)
            return app.supports_wallet
        except SupportedApp.DoesNotExist:
            return False

    def validate_linked_entity(self, value):
        user = self.context['request'].user
        if value.owner != user:
            raise serializers.ValidationError("You can only link payment modes to your own entities.")
        return value

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)
