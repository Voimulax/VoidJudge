import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNumber } from 'util';

import { ContestInfo, GetContestResultType, ContestState } from '../contest.model';
import { ContestService } from '../contest.service';

@Component({
  selector: 'app-contest-detail',
  templateUrl: './contest-detail.component.html',
  styleUrls: ['./contest-detail.component.css']
})
export class ContestDetailComponent implements OnInit, OnDestroy {
  isLoading = false;
  get contestInfo(): ContestInfo {
    return this.contestService.contestInfo;
  }

  private timer;

  constructor(private contestService: ContestService, private route: ActivatedRoute, private router: Router) {
    this.initContestInfo();
    this.timer = setInterval(() => {
      this.updateContestState();
    }, 1000);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.contestService.contestInfo = undefined;
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  getIsLoading() {
    return !this.contestInfo && this.isLoading;
  }

  private initContestInfo() {
    if (!this.contestInfo) {
      const id = this.route.snapshot.paramMap.get('id');
      const nid = Number(id);
      if (isNumber(nid) && !isNaN(nid)) {
        this.getContest(nid);
      } else {
        this.router.navigate(['/teacher/contest']);
      }
    } else {
      this.isLoading = false;
    }
  }

  private getContest(nid: number) {
    this.isLoading = true;
    this.contestService.get(nid).subscribe(
      x => {
        if (x.type === GetContestResultType.ok) {
          this.isLoading = false;
        } else {
          this.router.navigate(['/teacher/contest']);
        }
      },
      error => {
        this.router.navigate(['/teacher/contest']);
      }
    );
  }

  private updateContestState() {
    this.contestService.updateCurrentContestInfo();
  }
}
