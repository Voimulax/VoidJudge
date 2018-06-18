import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ContestInfo, GetContestResultType, ContestState } from '../contest.model';
import { ContestService } from '../contest.service';
import { DialogService } from '../../../shared/dialog/dialog.service';

@Component({
  selector: 'app-contest-list',
  templateUrl: './contest-list.component.html',
  styleUrls: ['./contest-list.component.css']
})
export class ContestListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['name', 'ownerName', 'startTime', 'endTime', 'state'];
  dataSource = new MatTableDataSource();
  isLoading = true;

  private url = '/student/contest';

  constructor(private contestService: ContestService, private dialogService: DialogService, private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.getContests();
  }

  isNotEmpty() {
    return this.dataSource.data && this.dataSource.data.length > 0;
  }

  goContestDetail(x: ContestInfo) {
    this.contestService.contestInfo = x;
    if (x.state === ContestState.InProgress) {
      this.contestService.contestInfo = undefined;
    }
    this.router.navigate([`${this.url}/${x.id}`]);
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
        if (data.type === GetContestResultType.ok) {
          this.dataSource.data = data.data;
        } else if (data.type === GetContestResultType.error) {
          this.dialogService.showErrorMessage('获取失败');
        }
      });
  }
}
