import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatTableDataSource } from '@angular/material';

import { DialogService } from '../../../../shared/dialog/dialog.service';
import { FileService } from '../../../../shared/file/file.service';
import { StudentInfo, StudentInfoWithSymbol } from '../../student.model';
import { StudentInfoDialogComponent } from '../student-info-dialog/student-info-dialog.component';
import { StudentService } from '../../student.service';
import { StudentListDialogComponent } from '../student-list-dialog/student-list-dialog.component';

@Component({
  selector: 'app-student-create-multi',
  templateUrl: './student-create-multi.component.html',
  styleUrls: ['./student-create-multi.component.css']
})
export class StudentCreateMultiComponent implements OnInit {
  displayedColumns = ['select', 'loginName', 'userName', 'group', 'password', 'sid'];
  dataSource = new MatTableDataSource<StudentInfoWithSymbol>();
  selection = new SelectionModel<StudentInfoWithSymbol>(true, []);
  isLoading = false;

  constructor(
    private dialog: MatDialog,
    private dialogService: DialogService,
    private fileService: FileService,
    private studentService: StudentService
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
        return { loginName: x.loginName, userName: x.userName, password: x.password };
      })
    );
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
        const repeatList = this.dataSource.data.filter(x =>
          data.find(y => y.loginName === x.loginName)
        );
        if (repeatList.length > 0) {
          this.dialog.open(StudentListDialogComponent, {
            data: { repeatList: repeatList },
            minWidth: '430px'
          });
        } else {
          const list = this.dataSource.data.concat(
            data.map(x => {
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

  edit(x: StudentInfoWithSymbol, event: MouseEvent) {
    event.stopPropagation();
    const dialog = this.dialog.open(StudentInfoDialogComponent, {
      data: x
    });
    dialog.afterClosed().subscribe(r => {
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
}
