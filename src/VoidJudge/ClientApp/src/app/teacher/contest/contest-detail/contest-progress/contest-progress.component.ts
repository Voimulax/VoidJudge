import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ContestInfo } from '../../contest.model';

@Component({
  selector: 'app-contest-progress',
  templateUrl: './contest-progress.component.html',
  styleUrls: ['./contest-progress.component.css']
})
export class ContestProgressComponent implements OnInit, OnDestroy {
  @Input() contestInfo: ContestInfo;
  @Input() update: Function;
  totalTime: number;
  restTime: number;
  private timer;

  get contestProgress(): number {
    return ((this.totalTime - this.restTime) / this.totalTime) * 100;
  }

  constructor() {}

  ngOnInit() {
    this.updateContestInfo();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private updateContestInfo() {
    this.timer = setInterval(() => {
      this.restTime = new Date(this.contestInfo.endTime).getTime() - Date.now();
      this.update();
      if (this.restTime <= 0) {
        this.restTime = 0;
        clearInterval(this.timer);
      }
    }, 1000);
    this.totalTime = new Date(this.contestInfo.endTime).getTime() - new Date(this.contestInfo.startTime).getTime();
  }
}
