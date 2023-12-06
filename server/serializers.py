from django.contrib.auth import get_user_model
from rest_framework import serializers
from permissions import IsManagerOrAdminOrOwner
from api.models.base.ticket_model import Ticket,FutureTicket
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role','password']
    #to send without password
    def to_representation(self, instance):
        if self.context['request'].method in ['GET', 'HEAD']:
            self.fields.pop('password', None)
        return super(UserSerializer, self).to_representation(instance)
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create_user(password=password, **validated_data)
        return user
    
class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name','password']
    def __init__(self, *args, **kwargs):
        super(UpdateUserSerializer, self).__init__(*args, **kwargs)
        for field_name in self.fields:
            self.fields[field_name].required = False

    def validate(self, data):
        return data 
    
 
class UserSerializerForTicket(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']
class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'

class FutureTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = FutureTicket
        fields = '__all__'
     
        
class TicketGetSerializer(serializers.ModelSerializer):
    created_by = UserSerializerForTicket(read_only=True)
    assigned_to = UserSerializerForTicket(read_only=True)
    status = serializers.SerializerMethodField()
    priority=serializers.SerializerMethodField()
    class Meta:
        model = Ticket
        fields = '__all__'   
    def get_status(self, obj):
        return dict(Ticket.STATUS_CHOICES).get(obj.status, None)
    def get_priority(self, obj):
        return dict(Ticket.PRIORITY_CHOICES).get(obj.priority, None)
class UpdateTicketSerializer(serializers.ModelSerializer):
    # assigned_to = UserSerializer(required=False)
    class Meta:
        model = Ticket
        fields = ['assigned_to', 'title', 'status', 'description','priority','next']
    def __init__(self, *args, **kwargs):
        super(UpdateTicketSerializer, self).__init__(*args, **kwargs)
        for field_name in self.fields:
            self.fields[field_name].required = False

    def validate(self, data):
        return data 

class UpdateFutureTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = FutureTicket
        fields = ['assigned_to', 'title', 'status', 'description','priority','scheduled_time']
    def __init__(self, *args, **kwargs):
        super(UpdateFutureTicketSerializer, self).__init__(*args, **kwargs)
        for field_name in self.fields:
            self.fields[field_name].required = False

    def validate(self, data):
        return data 
 
class TicketStatusUpdateSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    status = serializers.IntegerField()
    next=serializers.IntegerField()
    
class ChangePasswordSerializer(serializers.ModelSerializer):
      class Meta:
          model=User
          fields = ['password','email']