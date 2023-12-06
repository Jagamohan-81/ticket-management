import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  profileForm:FormGroup = new FormGroup({
    id: new FormControl(''),
    email: new FormControl(''),
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    password: new FormControl(''),
  });
  loading=false
  displayStyle='none'
  constructor(private profileService: ProfileService,private authService:AuthService,private router:Router) {
    this.getProfileData();
  }
  

  getProfileData() {
    this.loading=true
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.profileForm=new FormGroup({
          email: new FormControl(response.email),
          first_name: new FormControl(response.first_name),
          last_name: new FormControl(response.last_name),
          password: new FormControl(response.password),
        });
        
        this.loading=false
      },
      (error) => {
        if (error.status == 400) {
        }
        console.log('error--', error);
        this.loading=false
      }
    );
  }
  editProfile() {
    this.loading=true
    this.profileService.edit(this.profileForm.value).subscribe(
      (response: any) => {
        console.log("res--",response)
        this.closePopup()
        this.loading=false
        this.getProfileData()
      },
      (error) => {
        if (error.status == 400) {
        }
        console.log('error--', error);
        this.closePopup()
        this.loading=false
      }
    );
  }
  logout() {
    this.authService.logout()
    this.router.navigate(['/']);
  }
  openPopup() {
    
    this.displayStyle = 'block';
  }
  closePopup() {
   
    this.displayStyle = 'none';
  }
}

