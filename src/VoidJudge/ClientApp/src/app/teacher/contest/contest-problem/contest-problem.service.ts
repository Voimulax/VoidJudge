import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

import { DialogService } from '../../../shared/dialog/dialog.service';
import { ContestService } from '../contest.service';
import {
  ContestProblemInfo,
  AddContestProblemResultType,
  GetContestProblemResultType,
  DeleteContestProblemResultType
} from './contest-problem.model';

@Injectable({
  providedIn: 'root'
})
export class ContestProblemService {
  get contestInfo() {
    return this.contestService.contestInfo;
  }
  private get contestProblemBaseUrl() {
    return `/api/contest/${this.contestInfo.id}/problems`;
  }

  constructor(private dialogService: DialogService, private contestService: ContestService, private http: HttpClient) {}

  add(contestProblemInfo: ContestProblemInfo, file: any) {
    this.dialogService.isLoadingDialogActive = true;
    const data = new FormData();
    data.append('contestId', contestProblemInfo.contestId.toString());
    data.append('name', contestProblemInfo.name);
    data.append('type', contestProblemInfo.type.toString());
    data.append('file', file);
    return this.http.post(this.contestProblemBaseUrl, data).pipe(
      finalize(() => (this.dialogService.isLoadingDialogActive = false)),
      map(x => {
        if (x['error'] === 0) {
          return AddContestProblemResultType.ok;
        }
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 401 && e.error['error'] === AddContestProblemResultType.unauthorized) {
          return of(AddContestProblemResultType.unauthorized);
        } else if (e.status === 403 && e.error['error'] === AddContestProblemResultType.forbiddance) {
          return of(AddContestProblemResultType.forbiddance);
        } else if (e.status === 404 && e.error['error'] === AddContestProblemResultType.contestNotFound) {
          return of(AddContestProblemResultType.contestNotFound);
        } else if (e.status === 400 && e.error['error'] === AddContestProblemResultType.fileTooBig) {
          return of(AddContestProblemResultType.fileTooBig);
        } else if (e.status === 422 && e.error['error'] === AddContestProblemResultType.wrong) {
          return of(AddContestProblemResultType.wrong);
        } else {
          return of(AddContestProblemResultType.error);
        }
      })
    );
  }

  gets() {
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

  delete(id: number) {
    this.dialogService.isLoadingDialogActive = true;
    return this.http.delete(`${this.contestProblemBaseUrl}/${id}`).pipe(
      finalize(() => {
        this.dialogService.isLoadingDialogActive = false;
      }),
      map(x => {
        if (x['error'] === 0) {
          return DeleteContestProblemResultType.ok;
        }
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 401 && e.error['error'] === DeleteContestProblemResultType.unauthorized) {
          return of(DeleteContestProblemResultType.unauthorized);
        } else if (e.status === 404 && e.error['error'] === DeleteContestProblemResultType.contestNotFound) {
          return of(DeleteContestProblemResultType.contestNotFound);
        } else if (e.status === 404 && e.error['error'] === DeleteContestProblemResultType.problemNotFound) {
          return of(DeleteContestProblemResultType.problemNotFound);
        } else if (e.status === 403 && e.error['error'] === DeleteContestProblemResultType.forbiddance) {
          return of(DeleteContestProblemResultType.forbiddance);
        } else {
          return of(DeleteContestProblemResultType.error);
        }
      })
    );
  }
}
