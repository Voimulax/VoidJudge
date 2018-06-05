import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ContestInfo } from '../../contest.model';
import { ContestService } from '../../contest.service';

@Component({
  selector: 'app-contest-detail-in-progress',
  templateUrl: './contest-detail-in-progress.component.html',
  styleUrls: ['./contest-detail-in-progress.component.css']
})
export class ContestDetailInProgressComponent implements OnInit {
  get contestInfo(): ContestInfo {
    return this.contestService.contestInfo;
  }

  private url = '/teacher/contest';

  constructor(private contestService: ContestService, private router: Router) {}

  ngOnInit() {}

  updateContestInfo() {
    return () => this.contestService.updateCurrentContestInfo();
  }

  goBack() {
    this.router.navigate([this.url]);
  }
}
