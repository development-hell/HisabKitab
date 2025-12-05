from rest_framework import viewsets, permissions
from .models import Transaction
from .serializers import TransactionSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows transactions to be viewed or edited.
    """
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the transactions
        for the currently authenticated user.
        
        Since we removed the 'user' field, we need to filter by transactions
        where the user is the owner of either the payer or the payee entity.
        """
        user = self.request.user
        return Transaction.objects.filter(
            models.Q(payer__owner=user) | models.Q(payee__owner=user)
        ).distinct().order_by('-date')

from django.db import models
