from rest_framework import viewsets, status,mixins
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from api.pagination import StandardResultsSetPagination
from permissions import  IsManagerOrAdminOrOwner, IsManagerOrTicketOwner 
from rest_framework.authtoken.views import ObtainAuthToken
from django.utils.decorators import method_decorator
from rest_framework.authtoken.models import Token
from serializers import *
from ..models.base.ticket_model import Ticket,FutureTicket
from datetime import datetime
from django.utils import timezone
# from ..models.base.user import User
User = get_user_model()
class UserViewSet(viewsets.ModelViewSet): 
    serializer_class = UserSerializer
    authentication_classes=[TokenAuthentication]
    permission_classes=[IsAuthenticated,IsManagerOrAdminOrOwner]
    def get_queryset(self):
        role_filter = self.request.query_params.get('role', None)
        if role_filter == 'developer':
            return User.objects.filter(role='D').order_by('created_time')
        elif role_filter=='manager':
            return User.objects.filter(role='M').order_by('created_time')
        return User.objects.all().order_by('created_time')
    # Allow  create a new user without token for my need now.
    def get_permissions(self):
        if self.action == 'create':
            return []
        return super().get_permissions()
    #Tried set_password in model but it not worked in hashing , so used create again to override and hash password before storing
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # token, created = Token.objects.get_or_create(user=user.id)
        serializer.data['id'] = user.id
        # serializer.data['token']=token.key
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        serializer = UpdateUserSerializer(instance=self.get_object(), data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(request.data, status=status.HTTP_200_OK)
    
class ObtainAuth(ObtainAuthToken):
    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'data':{
            'user_id': user.pk,
            "name":user.first_name,
            'role': user.role,
            'email': user.email,},
            'token': token.key,
            'message': 'Authentication successful.'
        }, status=status.HTTP_200_OK)

class LogInViewSet(ObtainAuth,viewsets.ViewSet):
    authentication_classes =[]
    permission_classes=[]
    def create(self, request, *args, **kwargs):
        obtain_auth = ObtainAuth()
        return obtain_auth.create(request)
        
class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    authentication_classes =[TokenAuthentication]
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        assigne_to = self.request.query_params.get('assigne_to', None)
        created_by = self.request.query_params.get('created_by', None)
        if assigne_to :
            return Ticket.objects.filter(assigned_to_id=assigne_to)
        if created_by:
            return Ticket.objects.filter(created_by_id=created_by)
        return Ticket.objects.all()
    # Used below condition bcz-On get request i want created/assigned name from user table and in post request i send id only for them
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TicketGetSerializer
        return TicketSerializer

    def create(self, request, *args, **kwargs):
        # request.data._mutable = True
        data = request.data
        status = data.get('status', None)
        if status is None:
            return Response({'error': 'Status is required'}, status=400)
        
        #added here
        
        head = Ticket.objects.filter(status=status, next=0).first()
        linked_list, last_node=self.build_linked_list(head,status)
        latest_ticket=last_node
        
        #added here

        if latest_ticket is not None:
            last_ticket_id = latest_ticket.id
        else:
            last_ticket_id = None
        data['next'] = last_ticket_id  if last_ticket_id is not None else 0
        # request.data._mutable = False
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)
        
    def build_linked_list(self, start_ticket, status):
        linked_list = []
        current_ticket = start_ticket
        last_node = None
        while current_ticket:
            linked_list.append(current_ticket)
            last_node = current_ticket
            next_ticket = current_ticket.id
            current_ticket = Ticket.objects.filter(status=status, next=next_ticket).first()

        return linked_list, last_node   
    
    def update(self, request, *args, **kwargs):
        serializer = UpdateTicketSerializer(instance=self.get_object(), data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({'message': 'Update Ticket Successful', 'data':serializer.data }, status=status.HTTP_200_OK)
    
    
class FutureTicketViewSet(viewsets.ModelViewSet):
    serializer_class = FutureTicketSerializer
    authentication_classes =[TokenAuthentication]
    permission_classes=[IsAuthenticated] 
    today = timezone.now().date()
    queryset=FutureTicket.objects.all().filter(is_active=1, scheduled_time__gt=today)
    
    def create(self, request, *args, **kwargs):
        ticket_manager = FutureTicket.objects
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    def update(self, request, *args, **kwargs):
        serializer = UpdateFutureTicketSerializer(instance=self.get_object(), data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({'message': 'Update Ticket Successful', 'data':serializer.data }, status=status.HTTP_200_OK)
    









class ChangePasswordView(viewsets.ModelViewSet):
    serializer_class = ChangePasswordSerializer
    authentication_classes =[TokenAuthentication]
    permission_classes=[IsAuthenticated,IsManagerOrTicketOwner]
    def get_queryset(self):
        return User.objects.all()
    


class TicketStatusUpdateViewSet(mixins.UpdateModelMixin, viewsets.GenericViewSet):
    serializer_class = TicketStatusUpdateSerializer
    queryset = Ticket.objects.all()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()

        data = request.data

        # Update the status of each ticket based on the provided data
        for ticket_data in data:
            ticket_id = ticket_data['id']
            ticket_status = ticket_data['status']
            ticket_next = ticket_data['next']

            ticket = Ticket.objects.get(id=ticket_id)
            ticket.status = ticket_status
            ticket.next=ticket_next
            ticket.save()

        return super().update(request, instance, partial=partial)
