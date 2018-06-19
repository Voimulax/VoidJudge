import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatTableDataSource, MatPaginator } from '@angular/material';
import { StudentInfoWithSymbol, UserListDialogData } from '../../../../core/auth/user.model';

@Component({
  selector: 'app-student-list-dialog',
  templateUrl: './student-list-dialog.component.html',
  styleUrls: ['./student-list-dialog.component.css']
})
export class StudentListDialogComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['loginName', 'userName', 'group', 'password'];
  repeatSource = new MatTableDataSource<StudentInfoWithSymbol>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: UserListDialogData<StudentInfoWithSymbol>) {
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
