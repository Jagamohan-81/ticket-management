import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StudentDetailsService {
  private studentApiUrl = 'http://localhost:8000/student/';
  private userApiUrl='http://localhost:8000/user/';
  private apiUrl='http://localhost:8000/'
  
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `token ${token}`);
  }
  

  getUser(id:Number){
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}user/${id}`,{headers}) 
  }
  getMark(id:Number){
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}marklist/?student_id=${id}`,{headers})
  }
  getSubjects(){
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}subject/`,{headers})
  }
  deleteMark(id:Number){
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}marks/${id}`,{headers})
  }
  
  editMark(id:Number,data:any){
    const headers = this.getHeaders();
    return this.http.put(`${this.apiUrl}marks/${id}/`,data,{headers})
  }
  addMark(data:any){
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}marks/`,data,{headers})
  }

  getAllUserList(){
    const headers = this.getHeaders();
    return this.http.get(this.studentApiUrl,{headers})
  }
}
