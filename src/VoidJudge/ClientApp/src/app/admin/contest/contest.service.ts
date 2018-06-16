import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { GetContestsResult, GetContestResultType } from './contest.model';

@Injectable({
  providedIn: 'root'
})
export class ContestService {
  private contestsBaseUrl = '/api/contests';

  constructor(private http: HttpClient) {}

  gets() {
    return this.http.get<GetContestsResult>(this.contestsBaseUrl).pipe(
      map(x => {
        return x['data'].map(y => {
          return {
            id: y['id'],
            name: y['name'],
            startTime: new Date(y['startTime']).getTime(),
            endTime: new Date(y['endTime']).getTime(),
            ownerName: y['ownerName']
          };
        });
      }),
      map(x => {
        return {
          type: GetContestResultType.Ok,
          data: x
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
}
