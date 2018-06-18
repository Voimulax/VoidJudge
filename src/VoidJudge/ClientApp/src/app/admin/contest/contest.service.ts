import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

import { GetContestsResult, GetContestResultType } from './contest.model';
import { DialogService } from '../../shared/dialog/dialog.service';
import { DeleteContestResultType } from '../../teacher/contest/contest.model';

@Injectable({
  providedIn: 'root'
})
export class ContestService {
  private contestBaseUrl = '/api/contests';

  constructor(private dialogService: DialogService, private http: HttpClient) {}

  gets() {
    return this.http.get<GetContestsResult>(this.contestBaseUrl).pipe(
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

  clear(id: number) {
    this.dialogService.isLoadingDialogActive = true;
    return this.http.delete(`${this.contestBaseUrl}/${id}/clear`).pipe(
      finalize(() => (this.dialogService.isLoadingDialogActive = false)),
      map(x => {
        if (x['error'] === 0) {
          return DeleteContestResultType.ok;
        }
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 401 && e.error['error'] === DeleteContestResultType.unauthorized) {
          return of(DeleteContestResultType.unauthorized);
        } else if (e.status === 404) {
          return of(DeleteContestResultType.contestNotFound);
        } else if (e.status === 403) {
          return of(DeleteContestResultType.forbiddance);
        } else if (e.status === 400) {
          return of(e.error['error']);
        } else {
          return of(DeleteContestResultType.error);
        }
      })
    );
  }
}
