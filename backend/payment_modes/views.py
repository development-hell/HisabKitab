from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Payment_Mode
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
