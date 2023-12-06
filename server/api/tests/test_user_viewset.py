from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from ..models.base.user import User

# class UserApiTests(APITestCase):
#     def setUp(self):
#         self.user_data = {
#             'email': 'test@gmail.com',
#             'password': 'password',
#             'role': 'M',
#             'first_name': 'first name',
#             'last_name': 'last name'
#         }

#         # Create a user for testing
#         self.url = reverse('user-list')
#         self.response = self.client.post(self.url, self.user_data, format='json')
#         response_data = self.response.json()
#         self.user_id = response_data['id']

    #     # Log in and get a token
    #     self.test_login_token()

    # def test_login_token(self):
    #     self.user_data = {
    #         'username': 'test@gmail.com',
    #         'password': 'password',
    #     }

    #     # Log in a user for token
    #     self.url = reverse('login-list')
    #     self.response = self.client.post(self.url, self.user_data, format='json')
    #     response_data = self.response.json()
    #     print('login', response_data)
    #     self.token = response_data['token']

#     def test_retrieve_user(self):
#         headers = {'Authorization': f'token {self.token}'}
#         url = reverse('user-detail', args=[self.user_id])
#         response = self.client.get(url, headers=headers)
#         response_data=response.json()
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response_data['email'], self.user_data['username'])

#     def test_update_user(self): 
#         headers = {'Authorization': f'token {self.token}'}
#         url = reverse('user-detail', args=[self.user_id])
#         updated_data = {'email': 'updated@gmail.com', 'first_name': 'updated name'}
#         response = self.client.put(url, updated_data, headers=headers, format='json')
#         # print(111, response.json())
#         response_data=response.json()
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response_data['email'], updated_data['email'])
#         self.assertEqual(response_data['first_name'], updated_data['first_name'])

#     def test_delete_user(self):
#         headers = {'Authorization': f'token {self.token}'}
#         url = reverse('user-detail', args=[self.user_id])
#         response = self.client.delete(url, headers=headers)
#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
#         self.assertEqual(User.objects.count(), 0)










