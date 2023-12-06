import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  error_msg = '';
  loading = false;
  constructor(
    private loginService: LoginService,
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.loading = true;
    this.error_msg = '';
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe(
        (response: any) => {
          localStorage.setItem('token', response.token);
          this.authService.logIn(response.data);
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          if (error.status == 400) {
            this.error_msg = "Please use correct email and password"
          }
          this.loading = false;
          console.error('Login failed:', error);
        }
      );
    }
  }
}
