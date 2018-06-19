import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';

import { DialogService } from '../../../../shared/dialog/dialog.service';
import { FileService } from '../../../../shared/file/file.service';
import { StudentService } from '../../student.service';
import { StudentInfoDialogComponent } from '../student-info-dialog/student-info-dialog.component';
import { StudentListDialogComponent } from '../student-list-dialog/student-list-dialog.component';
import {
  RoleType,
  StudentInfoWithSymbol,
  StudentInfo,
  AddUserResultType,
  UserListDialogData
} from '../../../../core/auth/user.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-student-create-multi',
  templateUrl: './student-create-multi.component.html',
  styleUrls: ['./student-create-multi.component.css']
})
export class StudentCreateMultiComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('fileForm') fileForm: ElementRef;
  displayedColumns = ['select', 'loginName', 'userName', 'group', 'password', 'sid'];
  dataSource = new MatTableDataSource<StudentInfoWithSymbol>();
  selection = new SelectionModel<StudentInfoWithSymbol>(true, []);
  isLoading = false;

  private num = 1;

  constructor(
    private dialog: MatDialog,
    private dialogService: DialogService,
    private fileService: FileService,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

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
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  create() {
    this.isLoading = true;
    const sis: StudentInfo[] = this.dataSource.data.map(x => {
      return {
        loginName: x.loginName,
        userName: x.userName,
        password: x.password,
        group: x.group,
        roleType: RoleType.student
      };
    });
    this.studentService
      .adds(sis)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(x => {
        if (x.type === AddUserResultType.ok) {
          this.dialogService.showNoticeMessage('创建成功', () => {
            this.selection.clear();
            this.dataSource.data = [];
          });
        } else if (x.type === AddUserResultType.wrong) {
          this.dialogService.showErrorMessage('上传内容有错，创建失败');
        } else if (x.type === AddUserResultType.repeat) {
          const s = new Set(x.repeat.map(xx => xx.loginName));
          this.showStudentListDialog({
            type: '创建',
            repeatList: this.dataSource.data.filter(d => s.has(d.loginName))
          });
        } else {
          this.dialogService.showErrorMessage('网络错误');
        }
      });
  }

  import(evt: any, fileForm: HTMLFormElement) {
    const header = ['用户名', '姓名', '班级', '初始密码'];
    const propertys = ['loginName', 'userName', 'group', 'password'];
    this.fileService.readExcelFile<StudentInfoWithSymbol>(
      evt,
      { key: 'loginName', header: header, propertys: propertys },
      this.importCallback(fileForm)
    );
  }

  importCallback(fileForm: HTMLFormElement) {
    return (data: Array<StudentInfoWithSymbol>, error: Error) => {
      if (error) {
        this.dialogService.showErrorMessage(error.message);
        fileForm.reset();
      } else {
        const repeatList = this.dataSource.data.filter(x => data.find(y => y.loginName === x.loginName));
        if (repeatList.length > 0) {
          this.showStudentListDialog({
            type: '导入',
            repeatList: repeatList
          });
        } else {
          const list = this.dataSource.data.concat(
            data.map(x => {
              x['sid'] = this.num++;
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

  edit(x: StudentInfoWithSymbol, event: MouseEvent) {
    event.stopPropagation();
    this.showStudentInfoDialog(x, r => {
      if (r) {
        r = r as StudentInfo;
        x.loginName = r.loginName;
        x.userName = r.userName;
        x.group = r.group;
        x.password = r.password;
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

  private showStudentListDialog(data: UserListDialogData<StudentInfoWithSymbol>) {
    this.dialog.open(StudentListDialogComponent, {
      data: data,
      minWidth: '430px'
    });
  }

  private showStudentInfoDialog(data: StudentInfoWithSymbol, callback?: Function) {
    const dialog = this.dialog.open(StudentInfoDialogComponent, {
      data: data
    });
    dialog.afterClosed().subscribe(r => {
      if (callback) {
        callback(r);
      }
    });
  }
}
