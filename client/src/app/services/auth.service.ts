import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userName: string | null = null;
  private isLoggedInSubject = new BehaviorSubject<string>('');
  isLoggedIn$: Observable<string> = this.isLoggedInSubject.asObservable();
  
  constructor() { 
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.name;
    if(user.name){
      this.isLoggedInSubject.next(user.name);
    }
  }

  logIn(data:any){
    localStorage.setItem('user', JSON.stringify(data));
    this.isLoggedInSubject.next(data?.name);
  }
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedInSubject.next('');
  }
}

interface User{
  user_id:String|null,
  name:String |null,
  email:String |null,
  role:String |null
}