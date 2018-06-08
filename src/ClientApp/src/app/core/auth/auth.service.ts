import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, delay, map, catchError, switchMap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

import { TokenService } from './token.service';
import {
  User,
  UserType,
  getUserType,
  LoginUser,
  ResetUser
} from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  isLoggedIn = false;
  redirectUrl: string;

  private baseUrl = '/api/auth';
  private userBaseUrl = '/api/user';

  constructor(
    private http: HttpClient,
    private jwtHelperService: JwtHelperService,
    private tokenService: TokenService
  ) {
    if (this.checkLogin()) {
      this.getUser(this.tokenService.userId).subscribe(x => {
        this.afterLoginSuccess(x);
      });
    }
  }

  getUser<T extends User>(id: number): Observable<T> {
    return this.http.get(`${this.userBaseUrl}/${id}`).pipe(
      map(x => {
        if (x['error'] === '0') {
          const basicInfo = x['data']['basicInfo'];
          const roleCode = x['data']['roleCode'];
          const claimInfos = x['data']['claimInfos'];
          const user: T = <T>{
            id: Number(basicInfo['id']),
            loginName: String(basicInfo['loginName']),
            userName: String(basicInfo['userName']),
            userType: getUserType(roleCode)
          };
          claimInfos.forEach(c => {
            user[c['type']] = c['value'];
          });
          return user;
        }
      }),
      catchError((e: HttpErrorResponse) => {
        return of(null);
      })
    );
  }

  login(loginUser: LoginUser): Observable<AuthResult> {
    return this.http
      .post<LoginUser>(`${this.baseUrl}/login`, loginUser, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      })
      .pipe(
        map(x => {
          if (x['data']['token']) {
            this.tokenService.token = x['data']['token'];
            return AuthResult.ok;
          }
        }),
        switchMap(res => {
          if (res === AuthResult.ok) {
            return this.getUser(this.tokenService.userId).pipe(
              map(y => {
                if (y) {
                  this.afterLoginSuccess(y);
                  return AuthResult.ok;
                }
              })
            );
          }
        }),
        catchError((e: HttpErrorResponse) => {
          this.logout();
          if (e.status === 401) {
            return of(AuthResult.wrong);
          } else {
            return of(AuthResult.error);
          }
        })
      );
  }

  logout(): void {
    this.isLoggedIn = false;
    this.user = undefined;
    this.resetRedirectUrl();
    this.tokenService.remove();
  }

  resetPassword(resetUser: ResetUser) {
    return this.http
      .post<ResetUser>(`${this.baseUrl}/resetpassword`, resetUser, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      })
      .pipe(
        map(x => {
          if (x['error'] === '0') {
            return AuthResult.ok;
          }
        }),
        catchError((e: HttpErrorResponse) => {
          if (e.status === 401) {
            return of(AuthResult.wrong);
          } else {
            return of(AuthResult.error);
          }
        })
      );
  }

  private checkLogin(): boolean {
    const token = this.tokenService.token;
    if (token) {
      let flag: boolean;
      try {
        flag = this.jwtHelperService.isTokenExpired();
        if (!flag) {
          return true;
        } else {
          this.logout();
          return false;
        }
      } catch (error) {
        this.logout();
        return false;
      }
    } else {
      this.logout();
      return false;
    }
  }

  afterLoginSuccess(user: User) {
    this.user = user;
    this.isLoggedIn = true;
    this.resetRedirectUrl();
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

export enum AuthResult {
  ok,
  wrong,
  error
}
