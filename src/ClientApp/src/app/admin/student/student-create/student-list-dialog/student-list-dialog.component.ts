import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { StudentInfoWithSymbol, UserListDialogData } from '../../../../core/auth/user.model';

@Component({
  selector: 'app-student-list-dialog',
  templateUrl: './student-list-dialog.component.html',
  styleUrls: ['./student-list-dialog.component.css']
})
export class StudentListDialogComponent implements OnInit {
  displayedColumns = ['loginName', 'userName', 'group', 'password'];
  repeatSource = new MatTableDataSource<StudentInfoWithSymbol>();
  errorSource = new MatTableDataSource<StudentInfoWithSymbol>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: UserListDialogData<StudentInfoWithSymbol>) {
    this.repeatSource.data = data.repeatList;
  }

  ngOnInit() {}
}
