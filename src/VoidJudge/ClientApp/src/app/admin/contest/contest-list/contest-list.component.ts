import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { catchError, finalize, map, startWith } from 'rxjs/operators';

import { ContestInfo, GetContestResultType } from '../contest.model';
import { ContestService } from '../contest.service';
import { DialogService } from '../../../shared/dialog/dialog.service';

@Component({
  selector: 'app-contest-list',
  templateUrl: './contest-list.component.html',
  styleUrls: ['./contest-list.component.css']
})
export class ContestListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['select', 'name', 'ownerName', 'startTime', 'endTime'];
  dataSource = new MatTableDataSource<ContestInfo>();
  selection = new SelectionModel<ContestInfo>(true, []);
  isLoading = true;

  constructor(private dialogService: DialogService, private contestService: ContestService, private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.getContests();
  }

  isEmpty() {
    return !this.isLoading && (this.dataSource.data === undefined || this.dataSource.data.length <= 0);
  }

  isSelected() {
    return this.selection.selected.length <= 0;
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
    console.log(this.selection.selected);
  }

  private getContests() {
    this.isLoading = true;
    this.contestService
      .gets()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(data => {
        if (data.type === GetContestResultType.Ok) {
          this.dataSource.data = data.data;
        } else if (data.type === GetContestResultType.Error) {
          this.dialogService.showErrorMessage('获取失败');
        }
      });
  }
}
