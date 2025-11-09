from django.db import models
from django.conf import settings

class UserConnection(models.Model):
    STATUS_PENDING = "pending"
    STATUS_ACCEPTED = "accepted"
    STATUS_REJECTED = "rejected"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_ACCEPTED, "Accepted"),
        (STATUS_REJECTED, "Rejected"),
    ]

    connection_id = models.BigAutoField(primary_key=True)
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="connections_sent")
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="connections_received")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("requester", "receiver")
        indexes = [
            models.Index(fields=["requester", "receiver"]),
            models.Index(fields=["receiver", "status"]),
        ]

    def __str__(self):
        return f"{self.requester} -> {self.receiver} ({self.status})"
        
    objects: models.Manager["UserConnection"]
