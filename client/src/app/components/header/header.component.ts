import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkActive,RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterLinkActive,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  userName: string | null = '';
  isloading=true
  constructor(private authService:AuthService,private router:Router){

  }
  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.name;
    if(user.name){
      this.userName=user.name
      this.isloading=false
    }else{
      this.authService.isLoggedIn$.subscribe((username) => {
        this.userName = username;
        this.isloading=false
      });
    }
    
  }
  handleLogout(){
    this.authService.logout()
    this.router.navigate(['/']);
  }
}
