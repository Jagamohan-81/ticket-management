

# management/commands/check_future_tickets.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models.base.ticket_model import FutureTicket, Ticket


class Command(BaseCommand):
    help = 'Move future date tickets to the original ticket table if date approaches'

    def handle(self, *args, **options):
        current_time = timezone.now()
        future_tickets = FutureTicket.objects.filter(scheduled_time__lte=current_time + timezone.timedelta(days=2))

        for future_ticket in future_tickets:
            # Create a corresponding ticket in the original ticket table
            head = Ticket.objects.filter(status=future_ticket.status, next=0).first()
            linked_list, last_node = self.build_linked_list(head, future_ticket.status)
            ticket_next = last_node.id if last_node is not None else 0
            
            
            Ticket.objects.create(
                title=future_ticket.title,
                description=future_ticket.description,
                created_by=future_ticket.created_by,
                assigned_to=future_ticket.assigned_to,
                status=future_ticket.status,
                priority=future_ticket.priority,
                next=ticket_next
            )

            # Optionally, you can send a notification here
            

            # Delete the future date ticket
            future_ticket.delete()

        self.stdout.write(self.style.SUCCESS('Successfully moved future date tickets'))

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
        


