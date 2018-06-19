import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { DialogService } from '../../../shared/dialog/dialog.service';
import { TeacherService } from '../teacher.service';
import { UserInfo, DeleteUserResultType, getRoleTypeName, RoleType } from '../../../core/auth/user.model';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css']
})
export class TeacherListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['select', 'loginName', 'userName', 'roleType', 'id'];
  dataSource = new MatTableDataSource<UserInfo>();
  selection = new SelectionModel<UserInfo>(true, []);
  isLoading = true;

  private url = '/admin/teacher';

  constructor(private dialogService: DialogService, private teacherService: TeacherService, private router: Router) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.getTeachers();
  }

  isEmpty() {
    return !this.dataSource.data || this.dataSource.data.length <= 0;
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
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  delete() {
    if (this.selection.selected.length > 1) {
      this.dialogService.showErrorMessage('暂无批量删除功能', () => {
        this.selection.clear();
      });
    } else {
      this.dialogService.showOkMessage(
        `请问你确定要删除用户名为“${this.selection.selected[0].loginName}”的${getRoleTypeName(
          this.selection.selected[0].roleType
        )}吗`,
        () => {
          const id = this.selection.selected[0].id;
          this.teacherService.delete(id).subscribe(x => {
            if (x === DeleteUserResultType.ok) {
              this.dialogService.showNoticeMessage('删除成功', () => {
                this.selection.clear();
                this.getTeachers();
              });
            } else if (x === DeleteUserResultType.forbiddance) {
              if (this.selection.selected[0].roleType === RoleType.admin) {
                this.dialogService.showErrorMessage('此管理员是系统中唯一的管理员，暂时无法进行删除');
              } else {
                this.dialogService.showErrorMessage('此教师拥有未删除的考试，暂时无法进行删除');
              }
            } else if (x === DeleteUserResultType.userNotFound) {
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
