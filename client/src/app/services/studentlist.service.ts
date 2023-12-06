import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StudentlistService {
  private studentApiUrl = 'http://localhost:8000/student/';
  private userApiUrl='http://localhost:8000/user/';

  
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `token ${token}`);
  }
  

  addNewUser(newStudent:any){
    newStudent.role = 'S';
    const headers = this.getHeaders();
    return this.http.post(this.userApiUrl, newStudent,{headers}) 
  }
  editUser(newStudent:any,edit_id:Number){
    const headers = this.getHeaders();
    return this.http.put(`${this.userApiUrl}${edit_id}/`,newStudent,{headers})
  }
  deleteUser(id:Number){
    const headers = this.getHeaders();
    return this.http.delete(`${this.userApiUrl}${id}`,{headers})
  }
  getAllUserList(){
    const headers = this.getHeaders();
    return this.http.get(this.studentApiUrl,{headers})
  }
}
