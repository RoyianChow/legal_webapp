import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _registerUrl = "http://localhost:3000/register";
  private _loginUrl = "http://localhost:3000/login";
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  getIsLoggedIn() {
    return this.loggedIn.getValue();
  }

  registerUser(user: any) {
    return this.http.post<any>(this._registerUrl, user);
  }

  loginUser(user: any) {
    return this.http.post<any>(this._loginUrl, user).pipe(
      tap(() => this.loggedIn.next(true))
    );
  }

  logoutUser() {
    // Here you should implement your logout functionality,
    // but for now we will just change the loggedIn status.
    this.loggedIn.next(false);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.getIsLoggedIn()) {  // use getIsLoggedIn function
      return true;
    } else {
      alert('Please login first!');
      return false;
    }
  }
}
