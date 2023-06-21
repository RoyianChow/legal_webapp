import { Component } from '@angular/core';
import { AuthService } from '../auth.service'; // path to your auth service
import { Router } from '@angular/router'; // import Router here

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public authService: AuthService, private router: Router) { }

  upload() {
    this.router.navigate(['/upload']); // Assuming '/upload' is the route for your upload page
  }
}
