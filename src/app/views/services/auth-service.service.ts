import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


@Injectable()
export class AuthService {

  constructor(private cookieService: CookieService, private router: Router) { }

  private redirectUrl: string = '';
  private loginUrl: string = '/login';
  private isloggedIn: boolean = false;
  private loggedInUser: User;


  isUserLoggedIn(): boolean {
    return this.isloggedIn;
  }

  getRedirectUrl(): string {
    return this.redirectUrl;
  }

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  setIsUserLoggedIn(isloggedIn: boolean): void {
    this.isloggedIn = isloggedIn;
  }

  setLoggedInUser(user: User): void {
    this.loggedInUser = user;
  }

  getLoginUrl(): string {
    return this.loginUrl;
  }

  setLoginUrl(url: string): void {
    this.loginUrl = url;
  }

  getLoggedInUser(): User {
    return this.loggedInUser;
  }

  logoutUser(): void {
    this.isloggedIn = false;
    this.cookieService.delete('user');
    this.router.navigate([this.getLoginUrl()]);
  }

}
