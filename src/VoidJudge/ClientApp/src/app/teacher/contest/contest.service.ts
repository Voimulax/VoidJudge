import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';

import { ContestInfo, ContestState, GetContestResultType, GetContestsResult } from './contest.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContestService {
  contestInfo: ContestInfo;
  private contestBaseUrl = '/api/contests';

  constructor(private http: HttpClient) {}

  get(id: number) {
    return this.http.get<GetContestsResult>(`${this.contestBaseUrl}/${id}`).pipe(
      map(x => {
        const data = x['data'];
        return {
          id: data['id'],
          name: data['name'],
          startTime: new Date(data['startTime']).getTime(),
          endTime: new Date(data['endTime']).getTime(),
          notice: data['notice'],
          state: data['state'] === 0 ? ContestState.NoPublished : undefined
        };
      }),
      map(x => {
        return {
          type: GetContestResultType.Ok,
          data: this.updateContestState(x)
        };
      }),
      tap(x => {
        this.contestInfo = x.data;
        if (this.contestInfo === null) {
          this.contestInfo = undefined;
        }
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 404) {
          return of({
            type: GetContestResultType.NotFound,
            data: undefined
          });
        } else {
          return of({
            type: GetContestResultType.Error,
            data: undefined
          });
        }
      })
    );
  }

  gets() {
    return this.http.get<GetContestsResult>(this.contestBaseUrl).pipe(
      map(x => {
        return x['data'].map(y => {
          return {
            id: y['id'],
            name: y['name'],
            startTime: new Date(y['startTime']).getTime(),
            endTime: new Date(y['endTime']).getTime(),
            notice: y['notice'],
            state: y['state'] === 0 ? ContestState.NoPublished : undefined
          };
        });
      }),
      map(x => {
        return {
          type: GetContestResultType.Ok,
          data: x.map(y => this.updateContestState(y))
        };
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 404) {
          return of({
            type: GetContestResultType.NotFound,
            data: undefined
          });
        } else {
          return of({
            type: GetContestResultType.Error,
            data: undefined
          });
        }
      })
    );
  }

  updateCurrentContestInfo() {
    this.contestInfo = this.updateContestState(this.contestInfo);
  }

  updateContestState(x: ContestInfo) {
    if (x.state === ContestState.NoPublished) {
      return x;
    }
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
