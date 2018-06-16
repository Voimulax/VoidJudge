import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { MessageDialogData } from '../dialog.model';

@Component({
  selector: 'app-notice-dialog',
  templateUrl: './notice-dialog.component.html',
  styleUrls: ['./notice-dialog.component.css']
})
export class NoticeDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: MessageDialogData) {}

  ngOnInit() {}
}
