import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../enviroment';

interface User{
  user_id:String|null,
  name:String |null,
  email:String |null,
  role:String |null
}


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  user_id:Number=0
  constructor(private http: HttpClient) {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.user_id = user.user_id || 0;
    }
  }
  // environment.baseUrl
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `token ${token}`);
  }
  getProfile(){
    const headers=this.getHeaders()
    return this.http.get(`${environment.baseUrl}user/${this.user_id}`,{headers})

  }
  edit(data:any){
    const headers=this.getHeaders()
    if(data.password ==='' || data.password===null){
      delete data.password
    }
    return this.http.put(`${environment.baseUrl}user/${this.user_id}/`,data,{headers})
  }
  
}
