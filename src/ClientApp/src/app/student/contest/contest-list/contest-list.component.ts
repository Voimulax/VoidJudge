import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { catchError, finalize, map, startWith } from 'rxjs/operators';

import { ContestInfo } from '../contest.model';
import { ContestService } from '../contest.service';

@Component({
  selector: 'app-contest-list',
  templateUrl: './contest-list.component.html',
  styleUrls: ['./contest-list.component.css']
})
export class ContestListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['name', 'teacherName', 'startTime', 'endTime', 'state'];
  dataSource = new MatTableDataSource();
  isLoading = true;

  private url = '/student/contest';

  constructor(private contestService: ContestService, private router: Router) {}

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

  goContestDetail(x: ContestInfo) {
    this.contestService.contestInfo = x;
    this.router.navigate([`${this.url}/${x.id}`]);
  }
}
