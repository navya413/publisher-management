import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable()
export class AuthService {
  isLoggedIn = false;
  storage = 'sessionStorage';
  rememberMe = false;
  user = null;

  constructor(private router: Router, private http: HttpClient) {
    if (window.localStorage.user || window.sessionStorage.user) {
      this.isLoggedIn = true;
      this.user = window.localStorage.user || window.sessionStorage.user;
    }
  }


  login(email, password) {
    const base64Credentials = window.btoa(email + ':' + password);
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.set('Authorization', 'Basic ' + base64Credentials);

    return this.http.post(environment.adminApi + 'login', null, {
      headers
    });
  }

  /**
   * Redirects to the login page by deleting the
   * user details stored in localStorage
   */
  logout() {
    this.cleanUp();
    this.router.navigate(['login']);
  }

  cleanUp() {
    delete window.localStorage.user;
    delete window.localStorage.accessToken;
    window.sessionStorage.clear();
    this.user = null;
    this.isLoggedIn = this.rememberMe = false;
  }

  setStorage(userData: any) {
    this.isLoggedIn = true;
    if (this.rememberMe) {
      this.storage = 'localStorage';
    }
    window[this.storage].user = JSON.stringify(userData);
    window[this.storage].setItem('accessToken', userData.accessToken);
    this.user = userData;
  }

  public getToken(): string {
    return window[this.storage].getItem('accessToken') || null;
  }

}
