from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentModeViewSet

router = DefaultRouter()
router.register(r'', PaymentModeViewSet, basename='payment-mode')

urlpatterns = [
    path('', include(router.urls)),
]
