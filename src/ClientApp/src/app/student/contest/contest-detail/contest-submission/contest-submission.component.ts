import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { catchError, finalize, map, startWith } from 'rxjs/operators';

import { SubmissionFile } from './submission.model';
import { ContestService } from '../../contest.service';

@Component({
  selector: 'app-contest-submission',
  templateUrl: './contest-submission.component.html',
  styleUrls: ['./contest-submission.component.css']
})
export class ContestSubmissionComponent implements OnInit, AfterViewInit {
  displayedColumns = ['name', 'id'];
  dataSource = new MatTableDataSource<SubmissionFile>();
  isLoading = true;

  constructor(private contestService: ContestService, private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.isLoading = true;
    this.contestService
      .getSubmissionFileList()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(data => {
        this.dataSource.data = data;
      });
  }

  isUploaded() {
    return this.dataSource.data.length > 0;
  }

  upload(evt: any, fileForm: HTMLFormElement) {}

  reUpload(x: SubmissionFile) {}
}
