import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNumber } from 'util';

import { ContestInfo, ContestState, GetContestResultType } from '../contest.model';
import { ContestService } from '../contest.service';
import { StudentUser } from '../../../core/auth/user.model';
import { DialogService } from '../../../shared/dialog/dialog.service';

@Component({
  selector: 'app-contest-detail',
  templateUrl: './contest-detail.component.html',
  styleUrls: ['./contest-detail.component.css']
})
export class ContestDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = true;
  totalTime: number;
  restTime: number;
  downloadUrl =
    'https://download.microsoft.com/download/8/8/5/88544F33-836A-49A5-8B67-451C24709A8F/dotnet-sdk-2.1.300-win-x64.zip';

  private progressTimer;
  private flushTimer;
  private url = '/student/contest';

  get contestInfo(): ContestInfo {
    return this.contestService.contestInfo;
  }

  get contestProgress(): number {
    return ((this.totalTime - this.restTime) / this.totalTime) * 100;
  }

  constructor(
    private contestService: ContestService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {}

  download(event: MouseEvent) {
    event.stopPropagation();
  }

  ngAfterViewInit() {
    this.isLoading = true;
    this.initContestInfo();
  }

  ngOnDestroy() {
    this.contestService.contestInfo = undefined;
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
    }
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
  }

  getIsLoading() {
    return !this.contestInfo && this.isLoading;
  }

  goBack() {
    this.router.navigate([this.url]);
  }

  private updateContestInfo() {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
    }
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.getContest(this.contestInfo.id);
    }, 15000);
    this.progressTimer = setInterval(() => {
      const lastState = this.contestInfo.state;
      this.restTime = new Date(this.contestInfo.endTime).getTime() - Date.now();
      this.contestService.updateCurrentContestInfo();
      if (lastState !== ContestState.InProgress && this.contestInfo.state === ContestState.InProgress) {
        this.getContest(this.contestInfo.id);
      }
      if (this.restTime <= 0) {
        this.restTime = 0;
        clearInterval(this.progressTimer);
      }
    }, 1000);
    this.totalTime = this.contestInfo.endTime - this.contestInfo.startTime;
    this.isLoading = false;
  }

  private initContestInfo() {
    if (!this.contestService.contestInfo) {
      const id = this.route.snapshot.paramMap.get('id');
      const nid = Number(id);
      if (isNumber(nid) && !isNaN(nid)) {
        this.getContest(nid);
      } else {
        this.goBack();
      }
    } else {
      this.updateContestInfo();
    }
  }

  private getContest(nid: number) {
    this.contestService.get(nid).subscribe(
      x => {
        if (x.type === GetContestResultType.ok) {
          this.isLoading = false;
          this.updateContestInfo();
        } else if (x.type === GetContestResultType.invaildToken) {
          this.dialogService.showErrorMessage('你当前登录的IP地址不合法，无法获取考试信息', () => {
            this.goBack();
          });
        } else {
          this.goBack();
        }
      },
      error => {
        this.goBack();
      }
    );
  }
}
