import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { map, tap, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  ContestInfo,
  ContestState,
  GetContestResultType,
  GetContestsResult,
  AddContestResultType,
  PutContestResultType,
  DeleteContestResultType,
  GetContestSubmissionResultType,
  GetContestSubmissionInfosResult
} from './contest.model';
import { DialogService } from '../../shared/dialog/dialog.service';

@Injectable({
  providedIn: 'root'
})
export class ContestService {
  contestInfo: ContestInfo;
  private contestBaseUrl = '/api/contests';
  private get contestSubmissionsBaseUrl() {
    return `/api/contest/${this.contestInfo.id}/submissions`;
  }

  constructor(private dialogService: DialogService, private http: HttpClient) {}

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
          state: data['state'] === 0 ? ContestState.noPublished : undefined
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
          return of({ type: GetContestResultType.contestNotFound });
        } else {
          return of({ type: GetContestResultType.error });
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
            state: y['state'] === 0 ? ContestState.noPublished : undefined
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

  add(contestInfo: ContestInfo) {
    this.dialogService.isLoadingDialogActive = true;
    return this.http.post(this.contestBaseUrl, contestInfo).pipe(
      finalize(() => (this.dialogService.isLoadingDialogActive = false)),
      map(x => {
        if (x['error'] === 0) {
          return AddContestResultType.ok;
        }
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 400 && e.error['error'] === 1) {
          return of(AddContestResultType.wrong);
        } else {
          return of(AddContestResultType.error);
        }
      })
    );
  }

  put(contestInfo: ContestInfo) {
    this.dialogService.isLoadingDialogActive = true;
    return this.http.put(`${this.contestBaseUrl}/${contestInfo.id}`, contestInfo).pipe(
      finalize(() => (this.dialogService.isLoadingDialogActive = false)),
      map(x => {
        if (x['error'] === 0) {
          return PutContestResultType.ok;
        }
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 401 && e.error['error'] === PutContestResultType.unauthorized) {
          return of(PutContestResultType.unauthorized);
        } else if (e.status === 404) {
          return of(PutContestResultType.contestNotFound);
        } else if (e.status === 422) {
          return of(PutContestResultType.wrong);
        } else if (e.status === 400) {
          return of(e.error['error']);
        } else {
          return of(PutContestResultType.error);
        }
      })
    );
  }

  delete(id: number) {
    this.dialogService.isLoadingDialogActive = true;
    return this.http.delete(`${this.contestBaseUrl}/${id}`).pipe(
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

  getSubmissionsFile() {
    return this.http.get(this.contestSubmissionsBaseUrl, { params: new HttpParams().set('type', 'file') }).pipe(
      map(r => {
        if (r['error'] === 0) {
          this.contestInfo.submissionsFileName = r['data'];
          return GetContestSubmissionResultType.ok;
        }
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 401 && e.error['error'] === GetContestSubmissionResultType.unauthorized) {
          return of(GetContestSubmissionResultType.unauthorized);
        } else if (e.status === 404 && e.error['error'] === GetContestSubmissionResultType.contestNotFound) {
          return of(GetContestSubmissionResultType.contestNotFound);
        } else if (e.status === 403 && e.error['error'] === GetContestSubmissionResultType.forbiddance) {
          return of(GetContestSubmissionResultType.forbiddance);
        } else {
          return of(GetContestSubmissionResultType.error);
        }
      })
    );
  }

  getSubmissionsInfo() {
    return this.http
      .get<GetContestSubmissionInfosResult>(this.contestSubmissionsBaseUrl, {
        params: new HttpParams().set('type', 'info')
      })
      .pipe(
        map(r => {
          if (r['error'] === 0) {
            const data = r['data'].map(d => {
              if (d['submissionStates']) {
                d['submissionStates'] = d['submissionStates'].map(ss => {
                  if (ss['isSubmitted']) {
                    ss['lastSubmitted'] = new Date(ss['lastSubmitted']).getTime();
                    return ss;
                  } else {
                    ss['lastSubmitted'] = undefined;
                    return ss;
                  }
                });
                return d;
              }
            });
            this.contestInfo.submissionInfos = data;
            return { type: GetContestSubmissionResultType.ok, data: data };
          }
        }),
        catchError((e: HttpErrorResponse) => {
          if (e.status === 401 && e.error['error'] === GetContestSubmissionResultType.unauthorized) {
            return of({ type: GetContestSubmissionResultType.unauthorized, data: undefined });
          } else if (e.status === 404 && e.error['error'] === GetContestSubmissionResultType.contestNotFound) {
            return of({ type: GetContestSubmissionResultType.contestNotFound, data: undefined });
          } else if (e.status === 403 && e.error['error'] === GetContestSubmissionResultType.forbiddance) {
            return of({ type: GetContestSubmissionResultType.forbiddance, data: undefined });
          } else {
            return of({ type: GetContestSubmissionResultType.error, data: undefined });
          }
        })
      );
  }

  updateCurrentContestInfo() {
    this.contestInfo = this.updateContestState(this.contestInfo);
  }

  updateContestState(x: ContestInfo) {
    if (x !== undefined) {
      if (x.state === ContestState.noPublished) {
        return x;
      }
      const d = Date.now();
      const s = new Date(x.startTime).getTime();
      const e = new Date(x.endTime).getTime();
      if (d < s) {
        x.state = ContestState.noStarted;
      } else if (d >= s && d <= e) {
        x.state = ContestState.inProgress;
      } else {
        x.state = ContestState.ended;
      }
    }
    return x;
  }
}
