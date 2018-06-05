import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, startWith, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ContestInfo, ContestState } from './contest.model';

@Injectable({
  providedIn: 'root'
})
export class ContestService {
  contestInfo: ContestInfo;
  private contestUrl = '/api/contest';

  constructor(private http: HttpClient) {}

  getContest(id: number) {
    return this.http.get<ContestInfo>(`${this.contestUrl}/${id}`).pipe(
      map(data => {
        return this.updateContestState(data);
      }),
      tap(data => {
        this.contestInfo = data;
      })
    );
  }

  getContestList() {
    return this.http.get<ContestInfo[]>(this.contestUrl).pipe(
      startWith(Array<ContestInfo>()),
      map(data => {
        return data.map(this.updateContestState);
      })
    );
  }

  updateCurrentContestInfo() {
    this.contestInfo = this.updateContestState(this.contestInfo);
  }

  updateContestState(x: ContestInfo) {
    const d = Date.now();
    const s = new Date(x.startTime).getTime();
    const e = new Date(x.endTime).getTime();
    if (d < s) {
      x.state = ContestState.NoStarted;
    } else if (d >= s && d <= e) {
      x.state = ContestState.InProgress;
    } else {
      x.state = ContestState.Ended;
    }
    return x;
  }
}
