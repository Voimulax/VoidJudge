import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { OkDialogComponent } from './ok-dialog/ok-dialog.component';
import { NoticeDialogComponent } from './notice-dialog/notice-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  showErrorMessage(errorMessage: string, callback?: Function) {
    const dialog = this.dialog.open(ErrorDialogComponent, {
      data: { message: errorMessage }
    });
    dialog.afterClosed().subscribe(r => {
      if (callback) {
        callback();
      }
    });
  }

  showNoticeMessage(noticeMessage: string, callback?: Function) {
    const dialog = this.dialog.open(NoticeDialogComponent, {
      data: { message: noticeMessage }
    });
    dialog.afterClosed().subscribe(r => {
      if (callback) {
        callback();
      }
    });
  }

  showOkMessage(okMessage: string, okCallback?: Function, cancelCallback?: Function) {
    const dialog = this.dialog.open(OkDialogComponent, {
      data: { message: okMessage }
    });
    dialog.afterClosed().subscribe(r => {
      if (r) {
        if (okCallback) {
          okCallback();
        }
      } else {
        if (cancelCallback) {
          cancelCallback();
        }
      }
    });
  }
}
