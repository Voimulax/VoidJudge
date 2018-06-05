import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatTableDataSource } from '@angular/material';

import { DialogService } from '../../../../shared/dialog/dialog.service';
import { ContestStudentInfo } from '../contest-student.model';
import { ContestStudentListDialogComponent } from '../contest-student-list-dialog/contest-student-list-dialog.component';
import { ContestService } from '../../contest.service';
import { FileService } from '../../../../shared/file/file.service';

@Component({
  selector: 'app-contest-student-create',
  templateUrl: './contest-student-create.component.html',
  styleUrls: ['./contest-student-create.component.css']
})
export class ContestStudentCreateComponent implements OnInit {
  displayedColumns = ['select', 'userName', 'name', 'group'];
  dataSource = new MatTableDataSource<ContestStudentInfo>();
  selection = new SelectionModel<ContestStudentInfo>(true, []);
  isLoading = false;

  constructor(
    private dialog: MatDialog,
    private dialogService: DialogService,
    private fileService: FileService,
    private contestService: ContestService
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

  import(evt: any, fileForm: HTMLFormElement) {
    const header = ['用户名', '姓名', '班级'];
    const propertys = ['userName', 'name', 'group'];
    this.fileService.readExcelFile<ContestStudentInfo>(
      evt,
      { key: 'userName', header: header, propertys: propertys },
      this.importCallback(fileForm)
    );
  }

  importCallback(fileForm: HTMLFormElement) {
    return (data: Array<ContestStudentInfo>, error: Error) => {
      if (error) {
        this.dialogService.showErrorMessage(error.message);
        fileForm.reset();
      } else {
        const repeatList = this.dataSource.data.filter(x =>
          data.find(y => y.userName === x.userName)
        );
        if (repeatList.length > 0) {
          this.dialog.open(ContestStudentListDialogComponent, {
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
            return Number(a.userName) - Number(b.userName);
          });
          this.dataSource.data = list;
          this.contestService.contestInfo.students = list.map(x => {
            delete x['sid'];
            delete x['__rowNum__'];
            return x;
          });
        }
      }
    };
  }

  delete() {
    const select = new Set(this.selection.selected);
    this.dataSource.data = this.dataSource.data.filter(x => !select.has(x));
    this.contestService.contestInfo.students = this.dataSource.data.map(x => {
      delete x['sid'];
      delete x['__rowNum__'];
      return x;
    });
    this.selection.clear();
  }

  reset() {
    this.dataSource.data = [];
    this.contestService.contestInfo.students = [];
    this.selection.clear();
  }
}
