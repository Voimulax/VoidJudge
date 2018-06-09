import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@auth0/angular-jwt';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { tokenGetter } from './auth/token.service';
import { MaterialViewModule } from '../shared/material-view/material-view.module';
import { DialogModule } from '../shared/dialog/dialog.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:4200'],
        blacklistedRoutes: []
      }
    }),
  ],
  exports: [HttpClientModule, AuthModule, JwtModule, MaterialViewModule, DialogModule],
  declarations: []
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
