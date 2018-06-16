import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatTableDataSource } from '@angular/material';

import { DialogService } from '../../../../shared/dialog/dialog.service';
import { FileService } from '../../../../shared/file/file.service';
import { TeacherInfoDialogComponent } from '../teacher-info-dialog/teacher-info-dialog.component';
import { TeacherListDialogComponent } from '../teacher-list-dialog/teacher-list-dialog.component';
import { TeacherService } from '../../teacher.service';
import {
  RoleType,
  UserInfoWithSymbol,
  UserInfo,
  AddUserResultType,
  UserListDialogData,
  getRoleType
} from '../../../../core/auth/user.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-teacher-create-multi',
  templateUrl: './teacher-create-multi.component.html',
  styleUrls: ['./teacher-create-multi.component.css']
})
export class TeacherCreateMultiComponent implements OnInit {
  @ViewChild('fileForm') fileForm: ElementRef;
  displayedColumns = [
    'select',
    'loginName',
    'userName',
    'password',
    'roleType',
    'sid'
  ];
  dataSource = new MatTableDataSource<UserInfoWithSymbol>();
  selection = new SelectionModel<UserInfoWithSymbol>(true, []);
  isLoading = false;

  constructor(
    private dialog: MatDialog,
    private dialogService: DialogService,
    private fileService: FileService,
    private teacherService: TeacherService
  ) {}

  ngOnInit() {}

  isImported() {
    const flag = this.dataSource.data.length > 0;
    if (!flag) {
      this.fileForm.nativeElement.reset();
    }
    return flag;
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
    const sis: UserInfo[] = this.dataSource.data.map(x => {
      return {
        loginName: x.loginName,
        userName: x.userName,
        password: x.password,
        roleType: x.roleType
      };
    });
    this.teacherService.adds(sis).subscribe(x => {
      if (x.type === AddUserResultType.ok) {
        this.dialogService.showNoticeMessage('创建成功', () => {
          this.selection.clear();
          this.dataSource.data = [];
        });
      } else if (x.type === AddUserResultType.wrong) {
        this.dialogService.showErrorMessage('上传内容有错，创建失败');
      } else if (x.type === AddUserResultType.repeat) {
        const s = new Set(x.repeat.map(xx => xx.loginName));
        this.showTeacherListDialog({
          type: '创建',
          repeatList: this.dataSource.data.filter(d => s.has(d.loginName))
        });
      } else {
        this.dialogService.showErrorMessage('网络错误');
      }
    });
  }

  import(evt: any, fileForm: HTMLFormElement) {
    const header = ['用户名', '姓名', '初始密码', '用户类型'];
    const propertys = ['loginName', 'userName', 'password', 'roleType'];
    this.fileService.readExcelFile<UserInfoWithSymbol>(
      evt,
      { key: 'loginName', header: header, propertys: propertys },
      this.importCallback(fileForm)
    );
  }

  importCallback(fileForm: HTMLFormElement) {
    return (data: Array<UserInfoWithSymbol>, error: Error) => {
      if (error) {
        this.dialogService.showErrorMessage(error.message);
        fileForm.reset();
      } else {
        const repeatList = this.dataSource.data.filter(x =>
          data.find(y => y.loginName === x.loginName)
        );
        if (repeatList.length > 0) {
          this.showTeacherListDialog({
            type: '导入',
            repeatList: repeatList
          });
        } else {
          const list = this.dataSource.data.concat(
            data.map(x => {
              if (
                x['roleType'].toString() === '0' ||
                x['roleType'].toString() === '管理员'
              ) {
                x['roleType'] = RoleType.admin;
              } else {
                x['roleType'] = RoleType.teacher;
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

  edit(x: UserInfoWithSymbol, event: MouseEvent) {
    event.stopPropagation();
    this.showTeacherInfoDialog(x, r => {
      if (r) {
        r = r as UserInfo;
        x.loginName = r.loginName;
        x.userName = r.userName;
        x.password = r.password;
        x.roleType = getRoleType(r.roleType);
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

  private showTeacherListDialog(data: UserListDialogData<UserInfoWithSymbol>) {
    this.dialog.open(TeacherListDialogComponent, {
      data: data,
      minWidth: '430px'
    });
  }

  private showTeacherInfoDialog(data: UserInfoWithSymbol, callback?: Function) {
    const dialog = this.dialog.open(TeacherInfoDialogComponent, {
      data: data
    });
    dialog.afterClosed().subscribe(r => {
      if (callback) {
        callback(r);
      }
    });
  }
}
