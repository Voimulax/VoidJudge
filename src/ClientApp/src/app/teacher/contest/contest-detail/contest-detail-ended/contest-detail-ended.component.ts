import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ContestInfo } from '../../contest.model';
import { ContestService } from '../../contest.service';

@Component({
  selector: 'app-contest-detail-ended',
  templateUrl: './contest-detail-ended.component.html',
  styleUrls: ['./contest-detail-ended.component.css']
})
export class ContestDetailEndedComponent implements OnInit {
  get contestInfo(): ContestInfo {
    return this.contestService.contestInfo;
  }

  private url = '/teacher/contest';

  constructor(private contestService: ContestService, private router: Router) {}

  ngOnInit() {}

  updateContestInfo() {
    this.contestService.updateCurrentContestInfo();
  }

  downloadSubmission() { }

  downloadSubmissionInfo() {}

  goBack() {
    this.router.navigate([this.url]);
  }
}
