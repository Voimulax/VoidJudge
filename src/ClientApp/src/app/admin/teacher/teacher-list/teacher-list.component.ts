import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { catchError, finalize, map, startWith } from 'rxjs/operators';

import { DialogService } from '../../../shared/dialog/dialog.service';
import { TeacherService } from '../teacher.service';
import { UserInfo, DeleteResultType, getUserTypeName } from '../../../core/auth/user.model';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css']
})
export class TeacherListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['select', 'loginName', 'userName', 'userType', 'id'];
  dataSource = new MatTableDataSource<UserInfo>();
  selection = new SelectionModel<UserInfo>(true, []);
  isLoading = true;

  private url = '/admin/teacher';

  constructor(
    private dialogService: DialogService,
    private teacherService: TeacherService,
    private router: Router
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.getTeachers();
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

  delete() {
    if (this.selection.selected.length > 1) {
      this.dialogService.showErrorMessage('暂无批量删除功能', () => {
        this.selection.clear();
      });
    } else {
      this.dialogService.showOkMessage(
        `请问你确定要删除用户名为“${
          this.selection.selected[0].loginName
        }”的${getUserTypeName(this.selection.selected[0].userType)}吗`,
        () => {
          const id = this.selection.selected[0].id;
          this.teacherService.delete(id).subscribe(x => {
            if (x === DeleteResultType.ok) {
              this.dialogService.showNoticeMessage('删除成功', () => {
                this.selection.clear();
                this.getTeachers();
              });
            } else if (x === DeleteResultType.forbiddance) {
              this.dialogService.showErrorMessage('暂时无法进行删除');
            } else if (x === DeleteResultType.userNotFound) {
              this.dialogService.showErrorMessage('此用户不存在');
            } else {
              this.dialogService.showErrorMessage('网络错误');
            }
          });
        }
      );
    }
  }

  goCreate() {
    this.router.navigate([`${this.url}/create`]);
  }

  goDetail(x: UserInfo) {
    this.teacherService.teacherInfo = x;
    this.router.navigate([`${this.url}/${x.id}`]);
  }

  private getTeachers() {
    this.isLoading = true;
    this.teacherService
      .gets()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(data => {
        this.dataSource.data = data;
        if (data === null) {
          setTimeout(() => {
            this.dialogService.showErrorMessage('获取失败');
          }, 0);
        }
      });
  }
}
