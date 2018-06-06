import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatTableDataSource } from '@angular/material';

import { DialogService } from '../../../../shared/dialog/dialog.service';
import { FileService } from '../../../../shared/file/file.service';
import { TeacherInfo, TeacherInfoWithSymbol } from '../../teacher.model';
import { TeacherInfoDialogComponent } from '../teacher-info-dialog/teacher-info-dialog.component';
import { TeacherListDialogComponent } from '../teacher-list-dialog/teacher-list-dialog.component';
import { TeacherService } from '../../teacher.service';
import { UserType } from '../../../../core/auth/user.model';

@Component({
  selector: 'app-teacher-create-multi',
  templateUrl: './teacher-create-multi.component.html',
  styleUrls: ['./teacher-create-multi.component.css']
})
export class TeacherCreateMultiComponent implements OnInit {
  displayedColumns = ['select', 'loginName', 'userName', 'password', 'userType', 'sid'];
  dataSource = new MatTableDataSource<TeacherInfoWithSymbol>();
  selection = new SelectionModel<TeacherInfoWithSymbol>(true, []);
  isLoading = false;

  constructor(
    private dialog: MatDialog,
    private dialogService: DialogService,
    private fileService: FileService,
    private teacherService: TeacherService
  ) {}

  ngOnInit() {}

  isImported() {
    return this.dataSource.data.length > 0;
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

  create() {
    console.log(
      this.dataSource.data.map(x => {
        return { loginName: x.loginName, userName: x.userName, password: x.password, userType: x.userType };
      })
    );
  }

  import(evt: any, fileForm: HTMLFormElement) {
    const header = ['用户名', '姓名', '初始密码', '用户类型'];
    const propertys = ['loginName', 'userName', 'password', 'userType'];
    this.fileService.readExcelFile<TeacherInfoWithSymbol>(
      evt,
      { key: 'loginName', header: header, propertys: propertys },
      this.importCallback(fileForm)
    );
  }

  importCallback(fileForm: HTMLFormElement) {
    return (data: Array<TeacherInfoWithSymbol>, error: Error) => {
      if (error) {
        this.dialogService.showErrorMessage(error.message);
        fileForm.reset();
      } else {
        const repeatList = this.dataSource.data.filter(x =>
          data.find(y => y.loginName === x.loginName)
        );
        if (repeatList.length > 0) {
          this.dialog.open(TeacherListDialogComponent, {
            data: { repeatList: repeatList },
            minWidth: '430px'
          });
        } else {
          const list = this.dataSource.data.concat(
            data.map(x => {
              if (x['userType'].toString() === '0' || x['userType'].toString() === '管理员') {
                x['userType'] = UserType.admin;
              } else {
                x['userType'] = UserType.teacher;
              }
              x['sid'] = Symbol();
              return x;
            })
          );
          list.sort((a, b) => {
            return Number(a.loginName) - Number(b.loginName);
          });
          this.dataSource.data = list;
        }
      }
    };
  }

  edit(x: TeacherInfoWithSymbol, event: MouseEvent) {
    event.stopPropagation();
    const dialog = this.dialog.open(TeacherInfoDialogComponent, {
      data: x
    });
    dialog.afterClosed().subscribe(r => {
      if (r) {
        r = r as TeacherInfo;
        x.loginName = r.loginName;
        x.userName = r.userName;
        x.password = r.password;
        x.userType = Number(r.userType);
        const data = this.dataSource.data;
        for (let i = 0; i < data.length; i++) {
          if (data[i].sid === x.sid) {
            data[i] = x;
            break;
          }
        }
        this.dataSource.data = data;
      }
    });
  }

  delete() {
    const select = new Set(this.selection.selected);
    this.dataSource.data = this.dataSource.data.filter(x => !select.has(x));
    this.selection.clear();
  }
}
