import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ChangePasswordComponent } from './change-password/change-password.component';
import { DialogModule } from './dialog/dialog.module';
import { FileModule } from './file/file.module';
import { HeadComponent } from './head/head.component';
import { MaterialViewModule } from './material-view/material-view.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialViewModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule
  ],
  exports: [
    DialogModule,
    FileModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialViewModule,
    ChangePasswordComponent,
    HeadComponent
  ],
  declarations: [ChangePasswordComponent, HeadComponent]
})
export class SharedModule {}
