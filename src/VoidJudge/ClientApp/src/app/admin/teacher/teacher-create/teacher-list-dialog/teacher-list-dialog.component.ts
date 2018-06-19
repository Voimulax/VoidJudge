import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatTableDataSource, MatPaginator } from '@angular/material';
import { UserInfoWithSymbol, UserListDialogData } from '../../../../core/auth/user.model';

@Component({
  selector: 'app-teacher-list-dialog',
  templateUrl: './teacher-list-dialog.component.html',
  styleUrls: ['./teacher-list-dialog.component.css']
})
export class TeacherListDialogComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['loginName', 'userName', 'password', 'roleType'];
  repeatSource = new MatTableDataSource<UserInfoWithSymbol>();
  errorSource = new MatTableDataSource<UserInfoWithSymbol>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: UserListDialogData<UserInfoWithSymbol>) {
    this.repeatSource.data = data.repeatList;
  }

  ngOnInit() {
    this.repeatSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.repeatSource.filter = filterValue;
  }
}
