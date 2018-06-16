import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@NgModule({
  imports: [CommonModule],
  providers: [AuthGuard, AuthService, TokenService],
  declarations: []
})
export class AuthModule {}
