import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

import { TokenService } from './token.service';
import {
  User,
  UserType,
  getUserType,
  LoginUser,
  ResetUser
} from './user.model';
import { DialogService } from '../../shared/dialog/dialog.service';

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
    private dialogService: DialogService,
    private http: HttpClient,
    private jwtHelperService: JwtHelperService,
    private tokenService: TokenService
  ) {}

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
    this.dialogService.isLoadingDialogActive = true;
    return this.http
      .post(`${this.baseUrl}/resetpassword`, resetUser, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      })
      .pipe(
        finalize(() => {
          this.dialogService.isLoadingDialogActive = false;
        }),
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

  public checkLogin(): Observable<boolean> {
    if (this.isLoggedIn) {
      return of(true);
    }
    const token = this.tokenService.token;
    if (token) {
      let flag$: Observable<boolean>;
      try {
        flag$ = of(this.jwtHelperService.isTokenExpired());
        return flag$.pipe(
          switchMap(x => {
            if (!x) {
              return this.getUser(this.tokenService.userId).pipe(
                switchMap(y => {
                  if (y) {
                    this.afterLoginSuccess(y);
                    return of(true);
                  } else {
                    this.logout();
                    return of(false);
                  }
                })
              );
            } else {
              this.logout();
              return of(false);
            }
          })
        );
      } catch (error) {
        this.logout();
        return of(false);
      }
    } else {
      this.logout();
      return of(false);
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
