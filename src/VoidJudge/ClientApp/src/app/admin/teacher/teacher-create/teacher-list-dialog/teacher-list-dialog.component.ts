import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { UserInfoWithSymbol, UserListDialogData } from '../../../../core/auth/user.model';

@Component({
  selector: 'app-teacher-list-dialog',
  templateUrl: './teacher-list-dialog.component.html',
  styleUrls: ['./teacher-list-dialog.component.css']
})
export class TeacherListDialogComponent implements OnInit {
  displayedColumns = ['loginName', 'userName', 'password', 'roleType'];
  repeatSource = new MatTableDataSource<UserInfoWithSymbol>();
  errorSource = new MatTableDataSource<UserInfoWithSymbol>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: UserListDialogData<UserInfoWithSymbol>) {
    this.repeatSource.data = data.repeatList;
  }

  ngOnInit() {}
}
