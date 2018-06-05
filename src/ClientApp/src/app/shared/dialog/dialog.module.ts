import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogService } from './dialog.service';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

@NgModule({
  imports: [CommonModule],
  exports: [ErrorDialogComponent],
  entryComponents: [ErrorDialogComponent],
  declarations: [ErrorDialogComponent],
  providers: [DialogService]
})
export class DialogModule {}
