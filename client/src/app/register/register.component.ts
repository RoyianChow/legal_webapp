// register.component.ts

import { Component } from '@angular/core';
import { AuthService } from '../auth.service'; // path to your auth service

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  username = '';
  password = '';
  email = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.registerUser({username: this.username, password: this.password, email: this.email})
      .subscribe(
        () => alert('User registered successfully'),
        error => alert('User registration failed')
      );
  }
}
