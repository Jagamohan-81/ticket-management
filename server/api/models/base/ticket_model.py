

from django.db import models
from .user import User

class TicketManager(models.Manager):
    def create_ticket(self, title, description, created_by, assigned_to, status, priority):
        ticket = self.model(
            title=title,
            description=description,
            created_by=created_by,
            assigned_to=assigned_to,
            status=status,
            priority=priority
        )
        ticket.save(using=self._db)
        return ticket

    def get_tickets_by_priority(self):
        return self.order_by('-priority')

class Ticket(models.Model):
    STATUS_CHOICES = (
        (1, 'Todo'),
        (2, 'In Progress'),
        (3, 'Done'),
    )
    PRIORITY_CHOICES = (
        (1, 'Low'),
        (2, 'Medium'),
        (3, 'High'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tickets')
    created_time = models.DateTimeField(auto_now_add=True)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_tickets')
    status = models.IntegerField(choices=STATUS_CHOICES,default=1)
    priority = models.IntegerField(choices=PRIORITY_CHOICES, default=2) 
    next=models.IntegerField()
    # previous_ticket = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)    
    objects = TicketManager()  
    def __str__(self): 
        return self.title



class FutureTicketManager(models.Manager):
    def create_ticket(self, title, description, created_by, assigned_to, status, priority,scheduled_time):
        ticket = self.model(
            title=title,
            description=description,
            created_by=created_by,
            assigned_to=assigned_to,
            status=status,
            priority=priority,
            scheduled_time=scheduled_time,
        )
        ticket.save(using=self._db)
        return ticket

    def get_tickets_by_priority(self):
        return self.order_by('-priority')

class FutureTicket(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_future_tickets')
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_future_ticket')
    scheduled_time = models.DateTimeField()
    status = models.IntegerField(choices=Ticket.STATUS_CHOICES, default=1)
    priority = models.IntegerField(choices=Ticket.PRIORITY_CHOICES, default=2)
    is_active = models.BooleanField(default=1)
    objects=FutureTicketManager()

    def __str__(self):
        return self.tiatle