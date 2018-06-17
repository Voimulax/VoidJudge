import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, map, startWith, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ContestInfo, ContestState, GetContestResultType, GetContestsResult } from './contest.model';
import { GetContestProblemResultType } from './contest-detail/contest-problem-list/contest-problem.model';

@Injectable({
  providedIn: 'root'
})
export class ContestService {
  contestInfo: ContestInfo;
  private contestBaseUrl = '/api/contests';
  private get contestProblemBaseUrl() {
    return `/api/contest/${this.contestInfo.id}/problems`;
  }

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
          ownerName: data['ownerName'],
          notice: data['notice']
        };
      }),
      map(x => {
        return {
          type: GetContestResultType.ok,
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
            type: GetContestResultType.contestNotFound,
            data: undefined
          });
        } else if (e.status === 400 && e.error['error'] === GetContestResultType.invaildToken) {
          return of({
            type: GetContestResultType.invaildToken,
            data: undefined
          });
        } else {
          return of({
            type: GetContestResultType.error,
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
            ownerName: y['ownerName'],
            notice: y['notice']
          };
        });
      }),
      map(x => {
        return {
          type: GetContestResultType.ok,
          data: x.map(y => this.updateContestState(y))
        };
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 404) {
          return of({
            type: GetContestResultType.contestNotFound,
            data: undefined
          });
        } else {
          return of({
            type: GetContestResultType.error,
            data: undefined
          });
        }
      })
    );
  }

  getProblems() {
    return this.http.get(this.contestProblemBaseUrl).pipe(
      map(x => {
        if (x['error'] === 0) {
          return { type: GetContestProblemResultType.ok, data: x['data'] };
        }
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 401 && e.error['error'] === GetContestProblemResultType.unauthorized) {
          return of({ type: GetContestProblemResultType.unauthorized, data: undefined });
        } else if (e.status === 404 && e.error['error'] === GetContestProblemResultType.contestNotFound) {
          return of({ type: GetContestProblemResultType.contestNotFound, data: undefined });
        } else {
          return of({ type: GetContestProblemResultType.error, data: undefined });
        }
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
