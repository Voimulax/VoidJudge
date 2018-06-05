import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  showErrorMessage(errorMessage: string, callback?: Function) {
    const dialog = this.dialog.open(ErrorDialogComponent, {
      data: { errorMessage: errorMessage }
    });
    dialog.afterClosed().subscribe(r => {
      if (callback) {
        callback();
      }
    });
  }
}
