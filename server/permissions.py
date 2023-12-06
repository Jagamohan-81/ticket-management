from rest_framework.permissions import BasePermission
from rest_framework import permissions
class IsManagerOrAdminOrOwner(BasePermission):
    def has_permission(self, request, view):
        # Allow safe methods (GET, HEAD, OPTIONS) for all users
        print(request.user,33)
        if request.method in permissions.SAFE_METHODS:
            return True

        # Allow POST requests for creating a new user without authentication
        if request.method == 'POST' and not request.user.is_authenticated:
            return True

        # Allow if the user is authenticated for all other actions
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow if the user is an admin
        if request.user.is_staff:
            return True

        # Allow if the user is a manager and the request is a PUT, PATCH, or DELETE
        if request.user.role == 'M' and request.method in ['PUT', 'PATCH', 'DELETE']:
            return True

        # Allow if the user is the owner of the object
        return obj == request.user

class IsManagerOrTicketOwner(BasePermission):
    def has_permission(self, request, view):
        print(request.user.role,11111111,)

        # Allow GET requests for all users
        if request.method == 'GET':
            return True

        # Only managers can create, edit, or delete tickets
        return request.user.role == 'M'

    def has_object_permission(self, request, view, obj):
        # Allow managers to edit any ticket
        if request.user.role == 'M':
            return True
        # Allow developers to edit their own ticket
        print(request.user,222222222)
        return (
            request.user.is_authenticated 
            and request.user.role == 'D' 
            and request.user.id == obj.assigned_to
        ) if obj.assigned_to else False


