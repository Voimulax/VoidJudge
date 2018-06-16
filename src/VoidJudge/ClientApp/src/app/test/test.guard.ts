import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanLoad,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { Route } from '@angular/compiler/src/core';
import { environment } from '../../environments/environment';

@Injectable()
export class TestGuard implements CanActivate, CanLoad {
  constructor(private router: Router) {}

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    if (environment.production) {
      this.router.navigate(['/404']);
    }
    return !environment.production;
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (environment.production) {
      this.router.navigate(['/404']);
    }
    return !environment.production;
  }
}
