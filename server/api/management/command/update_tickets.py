from django.core.management.base import BaseCommand
from django.utils import timezone
from ...models.base.ticket_model import FutureTicket, Ticket

class Command(BaseCommand):
    help = 'Update tickets based on scheduled date'

    def handle(self, *args, **options):
        self.stdout.write('Task scheduler running')

        current_date = timezone.now().date()

        # Retrieve scheduled tickets with a scheduled_date equal to or before the current date
        scheduled_tickets = FutureTicket.objects.filter(scheduled_date__lte=current_date)

        for scheduled_ticket in scheduled_tickets:
            # Build linked list and update next field
            self.update_next_field(scheduled_ticket.ticket, scheduled_ticket.ticket.status)

            main_ticket_data = {
                'title': scheduled_ticket.ticket.title,
                'description': scheduled_ticket.ticket.description,
                'created_by': scheduled_ticket.ticket.created_by,
                'assigned_to': scheduled_ticket.ticket.assigned_to,
                'status': scheduled_ticket.ticket.status,
                'priority': scheduled_ticket.ticket.priority,
                'next': scheduled_ticket.ticket.next,
            }

            # Create the main ticket
            main_ticket = Ticket.objects.create_ticket(**main_ticket_data)

            # Delete the processed scheduled ticket
            scheduled_ticket.delete()

    def update_next_field(self, ticket, status):
        head = Ticket.objects.filter(status=status, next=0).first()
        linked_list, last_node = self.build_linked_list(head, status)

        # Check if there's at least one ticket in the linked list
        if linked_list:
            last_ticket_id = last_node.id
        else:
            last_ticket_id = 0

        ticket.next = last_ticket_id
        ticket.save()

    def build_linked_list(self, start_ticket, status):
        linked_list = []
        current_ticket = start_ticket
        last_node = None

        while current_ticket:
            linked_list.append(current_ticket)
            last_node = current_ticket
            current_ticket = Ticket.objects.filter(status=status, next=current_ticket.id).first()

        return linked_list, last_node
