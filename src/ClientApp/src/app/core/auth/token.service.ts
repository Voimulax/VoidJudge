import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { User, getUserType } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  get token(): string {
    return localStorage.getItem('access_token');
  }

  set token(value: string) {
    localStorage.setItem('access_token', value);
  }

  remove() {
    localStorage.removeItem('access_token');
  }

  get userId(): number {
    const data = this.jwtHelper.decodeToken(this.token);
    return  Number(data['id']);
  }

  constructor(private jwtHelper: JwtHelperService) {}
}

export function tokenGetter() {
  return localStorage.getItem('access_token');
}
