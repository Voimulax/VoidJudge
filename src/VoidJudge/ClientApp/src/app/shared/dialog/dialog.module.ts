import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogService } from './dialog.service';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { MaterialViewModule } from '../material-view/material-view.module';
import { NoticeDialogComponent } from './notice-dialog/notice-dialog.component';
import { OkDialogComponent } from './ok-dialog/ok-dialog.component';

@NgModule({
  imports: [CommonModule, MaterialViewModule],
  entryComponents: [ErrorDialogComponent, NoticeDialogComponent, OkDialogComponent],
  declarations: [ErrorDialogComponent, NoticeDialogComponent, OkDialogComponent],
  providers: [DialogService]
})
export class DialogModule {}
