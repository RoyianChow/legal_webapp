// login.component.ts
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../auth.service'; // path to your auth service

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = '';
  password = '';
  
  constructor(private authService: AuthService, private router: Router) {}


  onSubmit() {

    this.authService.loginUser({username: this.username, password: this.password})
  .subscribe(
    () => this.router.navigate(['/']), 
    err => console.error(err)
  );  }

}
