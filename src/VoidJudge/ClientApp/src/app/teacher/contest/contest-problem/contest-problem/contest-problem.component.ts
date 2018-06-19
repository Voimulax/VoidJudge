import { Component, OnInit, ViewChild } from '@angular/core';
import { ContestProblemListComponent } from '../contest-problem-list/contest-problem-list.component';

@Component({
  selector: 'app-contest-problem',
  templateUrl: './contest-problem.component.html',
  styleUrls: ['./contest-problem.component.css']
})
export class ContestProblemComponent implements OnInit {
  @ViewChild('appContestProblemList') appContestProblemList: ContestProblemListComponent;

  constructor() {}

  ngOnInit() {}
}
