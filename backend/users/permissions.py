from rest_framework import permissions

class IsAdminOrSelf(permissions.BasePermission):
    """
    Allows users to access/modify only their own data,
    unless they are admins.
    """

    def has_object_permission(self, request, view, obj):
        return request.user.role == "admin" or obj == request.user
