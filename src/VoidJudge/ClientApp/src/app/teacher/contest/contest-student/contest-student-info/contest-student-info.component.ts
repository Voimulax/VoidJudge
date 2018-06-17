import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { catchError, finalize, map, startWith } from 'rxjs/operators';

import { ContestStudentInfo, LoginType, SubmitType } from '../contest-student.model';
import { ContestService } from '../../contest.service';

@Component({
  selector: 'app-contest-student-info',
  templateUrl: './contest-student-info.component.html',
  styleUrls: ['./contest-student-info.component.css']
})
export class ContestStudentInfoComponent implements OnInit, AfterViewInit {
  displayedColumns = ['studentId', 'userName', 'group', 'isLogged', 'isSubmitted', 'sid'];
  dataSource = new MatTableDataSource<ContestStudentInfo>();
  isLoading = true;

  private url = '/teacher/contest';

  constructor(private contestService: ContestService, private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.dataSource.data = [
      {
        sid: Symbol(),
        studentId: 123,
        userName: 'student',
        group: '15-1',
        isLogged: LoginType.Logged,
        isSubmitted: SubmitType.NoSubmitted
      }
    ];
    this.isLoading = false;
  }

  unlock() {}
}
