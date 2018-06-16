import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { DialogService } from '../../../shared/dialog/dialog.service';
import { StudentService } from '../student.service';
import { StudentInfo, DeleteUserResultType } from '../../../core/auth/user.model';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['select', 'loginName', 'userName', 'group', 'id'];
  dataSource = new MatTableDataSource<StudentInfo>();
  selection = new SelectionModel<StudentInfo>(true, []);
  isLoading = true;

  private url = '/admin/student';

  constructor(private dialogService: DialogService, private studentService: StudentService, private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.getStudents();
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

  delete() {
    if (this.selection.selected.length > 1) {
      this.dialogService.showErrorMessage('暂无批量删除功能', () => {
        this.selection.clear();
      });
    } else {
      this.dialogService.showOkMessage(
        `请问你确定要删除用户名为“${this.selection.selected[0].loginName}”的学生吗`,
        () => {
          const id = this.selection.selected[0].id;
          this.studentService.delete(id).subscribe(x => {
            if (x === DeleteUserResultType.ok) {
              this.dialogService.showNoticeMessage('删除成功', () => {
                this.selection.clear();
                this.getStudents();
              });
            } else if (x === DeleteUserResultType.forbiddance) {
              this.dialogService.showErrorMessage('由于此学生正在参与考试，暂时无法进行删除');
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

  goDetail(x: StudentInfo) {
    this.studentService.studentInfo = x;
    this.router.navigate([`${this.url}/${x.id}`]);
  }

  private getStudents() {
    this.isLoading = true;
    this.studentService
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
