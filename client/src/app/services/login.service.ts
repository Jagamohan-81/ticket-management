import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../enviroment';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient,private authService:AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `token ${token}`);
  }

  login(data:any) {
    return this.http.post(`${environment.baseUrl}/login/`, data)
  }
  logOut(){
    return this.authService.logout()
  }
}
