import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { catchError, finalize, map, startWith } from 'rxjs/operators';

import { AuthService } from '../../../core/auth/auth.service';
import { ContestInfo } from '../contest.model';
import { ContestService } from '../contest.service';

@Component({
  selector: 'app-contest-list',
  templateUrl: './contest-list.component.html',
  styleUrls: ['./contest-list.component.css']
})
export class ContestListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['name', 'startTime', 'endTime', 'state'];
  dataSource = new MatTableDataSource();
  isLoading = true;

  private url = '/teacher/contest';

  constructor(
    private authService: AuthService,
    private contestService: ContestService,
    private router: Router
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.isLoading = true;
    this.contestService
      .getContestList()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(data => {
        this.dataSource.data = data;
      });
  }

  goContestCreate() {
    this.contestService.contestInfo = { name: '新考试', teacherId: this.authService.user.id };
    this.router.navigate([`${this.url}/create`]);
  }

  goContestDetail(x: ContestInfo) {
    this.contestService.contestInfo = x;
    this.router.navigate([`${this.url}/${x.id}`]);
  }
}
