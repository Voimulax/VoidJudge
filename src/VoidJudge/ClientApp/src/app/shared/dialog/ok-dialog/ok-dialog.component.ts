import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { MessageDialogData } from '../dialog.model';

@Component({
  selector: 'app-ok-dialog',
  templateUrl: './ok-dialog.component.html',
  styleUrls: ['./ok-dialog.component.css']
})
export class OkDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: MessageDialogData) { }

  ngOnInit() {
  }

}
