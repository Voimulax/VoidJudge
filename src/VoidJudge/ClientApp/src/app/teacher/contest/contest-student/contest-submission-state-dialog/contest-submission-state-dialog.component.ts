import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { SubmissionInfo } from '../../contest.model';

@Component({
  selector: 'app-contest-submission-state-dialog',
  templateUrl: './contest-submission-state-dialog.component.html',
  styleUrls: ['./contest-submission-state-dialog.component.css']
})
export class ContestSubmissionStateDialogComponent implements OnInit {
  displayedColumns = ['problemName', 'isSubmitted'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: SubmissionInfo) {}

  ngOnInit() {}
}
