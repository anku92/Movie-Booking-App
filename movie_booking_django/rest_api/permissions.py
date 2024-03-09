from rest_framework.permissions import BasePermission

class IsAdminOrSelf(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow admins to perform any action
        if request.user and request.user.is_staff:
            return True

        # Allow non-admin users to update their own profiles
        return request.user == obj