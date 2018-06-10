import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  GetContestsResult,
  GetContestResultType
} from './contest.model';

@Injectable({
  providedIn: 'root'
})
export class ContestService {
  private contestBaseUrl = '/api/contest';

  constructor(private http: HttpClient) {}

  gets() {
    return this.http.get<GetContestsResult>(this.contestBaseUrl).pipe(
      map(x => {
        return x['data'].map(y => {
          const b = y['basicInfo'];
          const a = y['claimInfos'].find(z => z['type'] === 'authorName');
          return {
            id: b['id'],
            name: b['name'],
            startTime: new Date(b['startTime']).getTime(),
            endTime: new Date(b['endTime']).getTime(),
            authorName: a['value']
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
