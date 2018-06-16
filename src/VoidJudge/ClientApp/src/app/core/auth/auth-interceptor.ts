import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((x: HttpErrorResponse) => {
        if (x.status === 401 && x.error === null) {
          this.authService.logoutOf401();
        } else {
          return throwError(x);
        }
      })
    );
  }
}
