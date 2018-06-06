import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, delay, map, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

import { TokenService } from './token.service';
import { User, UserType, getUserType } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  isLoggedIn = false;
  redirectUrl: string;

  private baseUrl = '/api/auth';

  constructor(
    private http: HttpClient,
    private jwtHelperService: JwtHelperService,
    private tokenService: TokenService
  ) {
    this.checkLogin();
  }

  login({
    loginName,
    password
  }: {
    loginName: string;
    password: string;
  }): Observable<LoginResult> {
    return this.http
      .post(
        `${this.baseUrl}/login`,
        { loginName: loginName, password: password },
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
      )
      .pipe(
      map(x => {
          if (x['data']['token']) {
            this.tokenService.token = x['data']['token'];
            this.user = this.tokenService.user;
            this.isLoggedIn = true;
            this.resetRedirectUrl();
            return LoginResult.ok;
          } else {
            this.logout();
            return LoginResult.wrong;
          }
        }),
        catchError((e: HttpErrorResponse) => {
          if (e.status === 401) {
            return of(LoginResult.wrong);
          } else {
            return of(LoginResult.error);
          }
        })
      );
  }

  logout(): void {
    this.isLoggedIn = false;
    this.user = undefined;
    this.resetRedirectUrl();
    localStorage.removeItem('access_token');
  }

  private checkLogin() {
    const token = this.tokenService.token;
    if (token) {
      let flag: boolean;
      try {
        flag = this.jwtHelperService.isTokenExpired();
        if (!flag) {
          this.user = this.tokenService.user;
          this.isLoggedIn = true;
          this.resetRedirectUrl();
        } else {
          this.logout();
        }
      } catch (error) {
        this.logout();
      }
    }
  }

  private resetRedirectUrl(): void {
    if (this.user === undefined) {
      this.redirectUrl = '/';
    } else {
      switch (this.user.userType) {
        case UserType.admin:
          this.redirectUrl = '/admin';
          break;
        case UserType.student:
          this.redirectUrl = '/student';
          break;
        case UserType.teacher:
          this.redirectUrl = '/teacher';
          break;
        default:
          this.redirectUrl = '/';
          break;
      }
    }
  }
}

export enum LoginResult {
  ok,
  wrong,
  error
}
