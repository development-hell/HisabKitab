from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from .models import Entity
from .serializers import EntitySerializer, ChatListItemSerializer
from connections.models import UserConnection
from connections.serializers import UserConnectionListSerializer

class EntityViewSet(viewsets.ModelViewSet):
    serializer_class = EntitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Entity.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ChatListViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        user = request.user
        
        # 1. Get Accepted Connections
        connections = UserConnection.objects.filter(
            (Q(requester=user) | Q(receiver=user)) & Q(status='accepted')
        )
        
        # 2. Get External Payees (Entities)
        entities = Entity.objects.filter(owner=user, type='EXTERNAL_PAYEE')
        
        # 3. Transform to unified format
        chat_list = []
        
        for conn in connections:
            friend = conn.receiver if conn.requester == user else conn.requester
            chat_list.append({
                'id': f"conn_{conn.connection_id}",
                'name': f"{friend.first_name} {friend.last_name}".strip() or friend.username,
                'type': 'USER',
                'status': 'online' if friend.is_active else 'offline',  # Use is_active field
                'avatar': None, # Placeholder
                'last_message': "No messages yet", # Placeholder
                'updated_at': conn.updated_at
            })
            
        for entity in entities:
            chat_list.append({
                'id': f"ent_{entity.entity_id}",
                'name': entity.name,
                'type': 'ENTITY',
                'status': None,
                'avatar': None,
                'last_message': None,
                'updated_at': entity.updated_at
            })
            
        # Sort by updated_at desc
        chat_list.sort(key=lambda x: x['updated_at'], reverse=True)
        
        serializer = ChatListItemSerializer(chat_list, many=True)
        return Response(serializer.data)
