import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatPaginator, MatTableDataSource } from '@angular/material';
import { SubmissionInfo, SubmissionState } from '../../contest.model';

@Component({
  selector: 'app-contest-submission-state-dialog',
  templateUrl: './contest-submission-state-dialog.component.html',
  styleUrls: ['./contest-submission-state-dialog.component.css']
})
export class ContestSubmissionStateDialogComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['problemName', 'isSubmitted', 'lastSubmitted'];
  dataSource = new MatTableDataSource<SubmissionState>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: SubmissionInfo) {
    this.dataSource.data = data.submissionStates;
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
