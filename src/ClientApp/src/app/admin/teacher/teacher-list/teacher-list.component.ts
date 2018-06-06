import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { catchError, finalize, map, startWith } from 'rxjs/operators';

import { TeacherInfo } from '../teacher.model';
import { TeacherService } from '../teacher.service';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css']
})
export class TeacherListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['select', 'loginName', 'userName', 'userType', 'id'];
  dataSource = new MatTableDataSource<TeacherInfo>();
  selection = new SelectionModel<TeacherInfo>(true, []);
  isLoading = true;

  private url = '/admin/teacher';

  constructor(private teacherService: TeacherService, private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.isLoading = true;
    this.teacherService
      .getTeacherList()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(data => {
        this.dataSource.data = data;
      });
  }

  isSelected() {
    return this.selection.hasValue();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  delete() {}

  goCreate() {
    this.router.navigate([`${this.url}/create`]);
  }

  goDetail(x: TeacherInfo) {
    this.teacherService.currentTeacherInfo = x;
    this.router.navigate([`${this.url}/${x.id}`]);
  }
}
