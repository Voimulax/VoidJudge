import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { finalize } from 'rxjs/operators';

import { DialogService } from '../../../../shared/dialog/dialog.service';
import { ContestService } from '../../contest.service';
import { FileService } from '../../../../shared/file/file.service';
import {
  ContestProblemInfo,
  GetContestProblemResultType,
  DeleteContestProblemResultType
} from '../contest-problem.model';
import { ContestProblemService } from '../contest-problem.service';

@Component({
  selector: 'app-contest-problem-list',
  templateUrl: './contest-problem-list.component.html',
  styleUrls: ['./contest-problem-list.component.css']
})
export class ContestProblemListComponent implements OnInit {
  @ViewChild('downloada') downloada: ElementRef;
  displayedColumns = ['select', 'name', 'type', 'content'];
  dataSource = new MatTableDataSource<ContestProblemInfo>();
  selection = new SelectionModel<ContestProblemInfo>(true, []);
  isLoading = false;

  get contestInfo() {
    return this.contestService.contestInfo;
  }

  constructor(
    private dialog: MatDialog,
    private dialogService: DialogService,
    private fileService: FileService,
    private contestService: ContestService,
    private contestProblemService: ContestProblemService
  ) {
    if (this.contestService.contestInfo.id !== undefined) {
      this.gets();
    }
  }

  ngOnInit() {}

  isImported() {
    return this.dataSource.data && this.dataSource.data.length > 0;
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

  download(event: MouseEvent, content: string) {
    event.stopPropagation();
    if (content !== undefined) {
      this.fileService.download(content).subscribe(r => {
        if (!r) {
          this.dialogService.showErrorMessage('下载失败');
        } else {
          this.downloada.nativeElement.href = r;
          this.downloada.nativeElement.download = content;
          this.downloada.nativeElement.click();
          this.downloada.nativeElement.href = '';
          this.downloada.nativeElement.download = '';
        }
      });
    }
  }

  gets() {
    this.isLoading = true;
    this.contestProblemService
      .gets()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(r => {
        if (r.type === GetContestProblemResultType.ok) {
          this.dataSource.data = r.data;
        }
      });
  }

  delete() {
    if (this.selection.selected.length > 1) {
      this.dialogService.showErrorMessage('暂无批量删除功能', () => {
        this.selection.clear();
      });
    } else {
      this.contestProblemService.delete(this.selection.selected[0].id).subscribe(r => {
        if (r === DeleteContestProblemResultType.ok) {
          this.gets();
          this.selection.clear();
        } else {
          this.dialogService.showErrorMessage('删除失败');
        }
      });
    }
  }

  reset() {
    this.dataSource.data = [];
    this.contestService.contestInfo.students = [];
    this.selection.clear();
  }
}
