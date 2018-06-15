import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

import { TokenService } from './token.service';
import { User, RoleType, getRoleType, LoginUser, ResetUser } from './user.model';
import { DialogService } from '../../shared/dialog/dialog.service';
import { Router } from '@angular/router';

export enum AuthResult {
  ok,
  wrong,
  error
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  isLoggedIn = false;
  redirectUrl: string;

  private authBaseUrl = '/api/auth';
  private usersBaseUrl = '/api/users';

  constructor(
    private dialogService: DialogService,
    private http: HttpClient,
    private jwtHelperService: JwtHelperService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  getUser<T extends User>(id: number): Observable<T> {
    return this.http.get(`${this.usersBaseUrl}/${id}`).pipe(
      map(x => {
        if (x['error'] === 0) {
          const data = x['data'];
          const user: T = <T>{
            id: Number(data['id']),
            loginName: String(data['loginName']),
            userName: String(data['userName']),
            roleType: Number(data['roleType'])
          };
          if (user.roleType === RoleType.student) {
            user['group'] = String(data['group']);
          }
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
      .post<LoginUser>(`${this.authBaseUrl}/login`, loginUser, {
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

  logoutOf401() {
    this.dialogService.showNoticeMessage('当前登录已过期，请重新登录...', () => {
      this.logout();
      this.router.navigate([`${this.redirectUrl}`]);
    });
  }

  resetPassword(resetUser: ResetUser) {
    this.dialogService.isLoadingDialogActive = true;
    return this.http
      .post(`${this.authBaseUrl}/resetpassword`, resetUser, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      })
      .pipe(
        finalize(() => {
          this.dialogService.isLoadingDialogActive = false;
        }),
        map(x => {
          if (x['error'] === 0) {
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
      switch (this.user.roleType) {
        case RoleType.admin:
          this.redirectUrl = '/admin';
          break;
        case RoleType.student:
          this.redirectUrl = '/student';
          break;
        case RoleType.teacher:
          this.redirectUrl = '/teacher';
          break;
        default:
          this.redirectUrl = '/';
          break;
      }
    }
  }
}
