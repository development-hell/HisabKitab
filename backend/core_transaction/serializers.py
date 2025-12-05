from rest_framework import serializers
from .models import Transaction
from entities.serializers import EntitySerializer
from payment_modes.serializers import PaymentModeSerializer

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['transaction_id', 'created_at', 'updated_at']

    def to_representation(self, instance):
        """
        Return detailed representation for read operations.
        """
        representation = super().to_representation(instance)
        representation['payer'] = EntitySerializer(instance.payer).data
        representation['payee'] = EntitySerializer(instance.payee).data
        # representation['mode'] = PaymentModeSerializer(instance.mode).data
        return representation
