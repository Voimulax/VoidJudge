import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';

import { StudentInfoWithSymbol } from '../../student.model';
import { StudentListDialogData } from '../../student.model';

@Component({
  selector: 'app-student-list-dialog',
  templateUrl: './student-list-dialog.component.html',
  styleUrls: ['./student-list-dialog.component.css']
})
export class StudentListDialogComponent implements OnInit {
  displayedColumns = ['userName', 'name', 'group', 'password'];
  repeatSource = new MatTableDataSource<StudentInfoWithSymbol>();
  errorSource = new MatTableDataSource<StudentInfoWithSymbol>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: StudentListDialogData) {
    this.repeatSource.data = data.repeatList;
  }

  ngOnInit() {}
}
