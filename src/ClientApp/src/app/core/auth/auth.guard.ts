import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

import { AuthService } from './auth.service';
import { RoleType } from './user.model';
import { tap, map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;
    const roleType = <RoleType | undefined>next.data['roleType'];
    return this.checkLogin(url, roleType);
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    const url = `/${route.path}`;
    const roleType = <RoleType | undefined>route.data['roleType'];
    return this.checkLogin(url, roleType);
  }

  checkLogin(
    url: string | undefined,
    roleType: RoleType | undefined
  ): Observable<boolean> {
    if (url === '/404') {
      return of(true);
    }

    return this.authService.checkLogin().pipe(
      map(x => {
        if (x) {
          if (this.authService.user.roleType !== roleType) {
            this.router.navigate([this.authService.redirectUrl]);
            return true;
          } else {
            return true;
          }
        } else {
          if (url === '/') {
            return true;
          } else {
            this.router.navigate(['/']);
            return true;
          }
        }
      })
    );
  }
}
