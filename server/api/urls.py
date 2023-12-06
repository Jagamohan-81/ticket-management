from rest_framework import routers
from api.views import *

router = routers.DefaultRouter ()
router.register(r'version', VersionViewSet, basename='Version')
router.register(r'user', UserViewSet, basename='user')
router.register(r'login', LogInViewSet, basename='login')
router.register(r'ticket', TicketViewSet, basename='ticket')
router.register(r'futureticket', FutureTicketViewSet, basename='future-ticket')

# router.register(r'change',ChangePasswordView,basename='change-password')
# router.register(r'tickets/status/', TicketStatusUpdateViewSet.as_view({'patch': 'update'}), basename='ticket-status-update')





