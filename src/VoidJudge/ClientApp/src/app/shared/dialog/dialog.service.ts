import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { OkDialogComponent } from './ok-dialog/ok-dialog.component';
import { NoticeDialogComponent } from './notice-dialog/notice-dialog.component';
import { Subject, Subscription, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private isLoadingDialogActiveSubj: Subject<boolean>;
  isLoadingDialogActive$: Observable<boolean>;

  constructor(private dialog: MatDialog) {
    this.isLoadingDialogActiveSubj = new Subject<boolean>();
    this.isLoadingDialogActive$ = this.isLoadingDialogActiveSubj.pipe();
   }

  set isLoadingDialogActive(value: boolean) {
    this.isLoadingDialogActiveSubj.next(value);
  }

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
