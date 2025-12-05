from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Payment_Mode, SupportedApp
from .serializers import PaymentModeSerializer
from .constants import SUPPORTED_APPS

class PaymentModeViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentModeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment_Mode.objects.filter(owner=self.request.user)

    @action(detail=False, methods=['get'])
    def options(self, request):
        """
        Returns the server-defined list of supported payment apps/modes.
        """
        from .models import SupportedApp
        from .serializers import SupportedAppSerializer
        
        apps = SupportedApp.objects.all()
        serializer = SupportedAppSerializer(apps, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='create-wallet')
    def create_wallet(self, request, pk=None):
        """
        Smart Setup: Creates a WALLET Entity and links it to this Payment Mode.
        Only allowed if the underlying SupportedApp supports wallets.
        """
        payment_mode = self.get_object()
        
        # 1. Check if app supports wallet
        try:
            supported_app = SupportedApp.objects.get(key=payment_mode.app_key)
        except SupportedApp.DoesNotExist:
             return Response(
                {"error": "This payment mode type is not supported."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not supported_app.supports_wallet:
            return Response(
                {"error": f"{supported_app.name} does not support wallets."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Check if already linked
        if payment_mode.linked_entity:
             return Response(
                {"error": "This payment mode is already linked to an entity."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Create Wallet Entity
        from entities.models import Entity
        wallet_entity = Entity.objects.create(
            owner=request.user,
            name=f"{payment_mode.name} Wallet",
            type="WALLET"
        )

        # 4. Link Payment Mode
        payment_mode.linked_entity = wallet_entity
        payment_mode.save()

        # 5. Return success
        return Response({
            "message": "Wallet created successfully",
            "wallet_id": wallet_entity.entity_id,
            "wallet_name": wallet_entity.name
        }, status=status.HTTP_201_CREATED)
