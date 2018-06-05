import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

import { AuthModule } from './auth.module';
import { User, UserType, Users } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  isLoggedIn = false;
  redirectUrl: string;

  constructor() {
    this.checkLogin();
  }

  login({ userName, password }: { userName: string; password: string }): Observable<boolean> {
    const user = Users.find((x: User) => x.userName === userName);
    let flag = false;
    if (user && user.userName[0] === password) {
      flag = true;
    }

    return of(flag).pipe(
      delay(1000),
      tap(val => {
        this.isLoggedIn = val;
        this.user = user;
        if (val) {
          localStorage.setItem('access_token', user.userName);
          this.resetRedirectUrl();
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
    const token = localStorage.getItem('access_token');
    if (token) {
      this.user = Users.find((x: User) => x.userName === token);
      if (this.user) {
        this.isLoggedIn = true;
        this.resetRedirectUrl();
      } else {
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

export function tokenGetter() {
  return localStorage.getItem('access_token');
}
