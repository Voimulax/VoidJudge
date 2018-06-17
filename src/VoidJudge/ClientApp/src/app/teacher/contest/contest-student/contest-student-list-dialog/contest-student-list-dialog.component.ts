import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';

import { ContestStudentInfo } from '../contest-student.model';
import { ContestStudentListDialogData } from '../contest-student.model';

@Component({
  selector: 'app-contest-student-list-dialog',
  templateUrl: './contest-student-list-dialog.component.html',
  styleUrls: ['./contest-student-list-dialog.component.css']
})
export class ContestStudentListDialogComponent implements OnInit {
  displayedColumns = ['studentId', 'userName', 'group'];
  repeatSource = new MatTableDataSource<ContestStudentInfo>();
  notFoundSource = new MatTableDataSource<ContestStudentInfo>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: ContestStudentListDialogData) {
    if (data.repeatList) {
      this.repeatSource.data = data.repeatList;
    }
    if (data.notFoundList) {
      this.notFoundSource.data = data.notFoundList;
    }
  }

  ngOnInit() {}

  isRepeat() {
    return this.data.repeatList !== undefined;
  }

  isNotFound() {
    return this.data.notFoundList !== undefined;
  }
}
