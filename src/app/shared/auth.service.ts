import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint: string = 'https://dev.greenkoncepts.com/gktest';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
  Allorders={};
  constructor(private http: HttpClient, public router: Router) {}

  // Sign-in
  signIn(user: User) {
    debugger;
    return this.http
      .get<any>(`${this.endpoint}/login?username=${user.username}&password=${user.password}`)
      .subscribe((res: any) => {
        console.log(res, "Get User");
        localStorage.setItem('access_token', res.key);
        this.currentUser = res;
        this.router.navigate(['home/']);
          // this.getAllOrders(res.key).subscribe((res) => {
          //   this.Allorders = res;
          //   console.log(this.Allorders,'Allorders')
          //   this.router.navigate(['user/']);
          // });
      });
  }
  getToken() {
    return localStorage.getItem('access_token');
  }
  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return authToken !== null ? true : false;
  }
  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['log-in']);
    }
  }
  getAllOrders(): Observable<any> {
    let token = this.getToken();
    let api = `${this.endpoint}/getAllOrders?token=${token}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }
  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}