import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { UserType } from './user.model';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;
    const userType = <UserType | undefined>next.data['userType'];
    return this.checkLogin(url, userType);
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    const url = `/${route.path}`;
    const userType = <UserType | undefined>route.data['userType'];
    return this.checkLogin(url, userType);
  }

  checkLogin(url: string | undefined, userType: UserType | undefined): boolean {
    if (url === '/404') {
      return true;
    }

    if (this.authService.isLoggedIn) {
      if (this.authService.user.userType !== userType) {
        this.router.navigate([this.authService.redirectUrl]);
        return true;
      }
      return true;
    }

    if (url === '/') {
      return true;
    }

    this.router.navigate(['/']);
    return true;
  }
}
