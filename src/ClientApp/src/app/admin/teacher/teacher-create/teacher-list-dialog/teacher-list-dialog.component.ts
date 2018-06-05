import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';

import { TeacherInfoWithSymbol } from '../../teacher.model';
import { TeacherListDialogData } from '../../teacher.model';

@Component({
  selector: 'app-teacher-list-dialog',
  templateUrl: './teacher-list-dialog.component.html',
  styleUrls: ['./teacher-list-dialog.component.css']
})
export class TeacherListDialogComponent implements OnInit {
  displayedColumns = ['userName', 'name', 'password', 'userType'];
  repeatSource = new MatTableDataSource<TeacherInfoWithSymbol>();
  errorSource = new MatTableDataSource<TeacherInfoWithSymbol>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: TeacherListDialogData) {
    this.repeatSource.data = data.repeatList;
  }

  ngOnInit() {}
}
