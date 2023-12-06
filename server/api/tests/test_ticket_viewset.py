from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from ..models.base.ticket_model import Ticket
from ..models.base.user import User  

class TicketApiTests(APITestCase):
    def setUp(self):
        # Create a user for testing
        self.user_data = {
            'email': 'test@gmail.com',
            'password': 'password',
            'role': 'M',
            'first_name': 'first name',
            'last_name': 'last name'
        }
        self.user = User.objects.create_user(**self.user_data)
        self.test_login_token()

    def test_login_token(self):
        # Log in a user for token
        self.url = reverse('login-list')
        self.response = self.client.post(self.url, {'username':self.user_data.email,'password':self.user_data.password}, format='json')
        response_data = self.response.json()
        print('login', response_data)
        self.token = response_data['token']

        # Create a ticket for testing
        self.ticket_data = {
            'title': 'Test Ticket',
            'description': 'This is a test ticket.',
            'created_by': self.user,  # Pass the user instance instead of the user ID
            'assigned_to': self.user,  # Pass the user instance instead of the user ID
            'status': 1,
            'priority': 2,
            'next': 1,
        }
        self.ticket = Ticket.objects.create(**self.ticket_data)

    def test_retrieve_ticket(self):
        url = reverse('ticket-detail', args=[self.ticket.id])
        headers = {'Authorization': f'token {self.token}'}
        response = self.client.get(url, headers=headers)
        print(1111111111111111111111111,response.json())
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.ticket_data['title'])

    # def test_update_ticket(self):
    #     url = reverse('ticket-detail', args=[self.ticket.id])
    #     headers = {'Authorization': f'Token {self.token}'}
    #     updated_data = {'title': 'Updated Ticket', 'description': 'Updated description'}
    #     response = self.client.put(url, updated_data, headers=headers, format='json')

    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(response.data['title'], updated_data['title'])
    #     self.assertEqual(response.data['description'], updated_data['description'])

    # def test_delete_ticket(self):
    #     url = reverse('ticket-detail', args=[self.ticket.id])
    #     headers = {'Authorization': f'Token {self.token}'}
    #     response = self.client.delete(url, headers=headers)

    #     self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    #     self.assertEqual(Ticket.objects.count(), 0)
