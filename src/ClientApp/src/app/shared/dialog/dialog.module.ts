import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogService } from './dialog.service';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { OkDialogComponent } from './ok-dialog/ok-dialog.component';

@NgModule({
  imports: [CommonModule],
  exports: [ErrorDialogComponent],
  entryComponents: [ErrorDialogComponent, OkDialogComponent],
  declarations: [ErrorDialogComponent, OkDialogComponent],
  providers: [DialogService]
})
export class DialogModule {}
