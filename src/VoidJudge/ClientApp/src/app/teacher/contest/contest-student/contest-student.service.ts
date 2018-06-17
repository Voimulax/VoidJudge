import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

import { DialogService } from '../../../shared/dialog/dialog.service';
import { ContestService } from '../contest.service';
import {
  AddContestStudentResultType,
  AddContestStudentsResult,
  GetContestStudentResultType,
  ContestStudentInfo,
  GetContestStudentsResult
} from './contest-student.model';

@Injectable({
  providedIn: 'root'
})
export class ContestStudentService {
  get contestInfo() {
    return this.contestService.contestInfo;
  }

  private get contestStudentBaseUrl() {
    return `/api/contest/${this.contestInfo.id}/students`;
  }

  constructor(private dialogService: DialogService, private contestService: ContestService, private http: HttpClient) {}

  gets() {
    return this.http.get<GetContestStudentsResult>(this.contestStudentBaseUrl).pipe(
      map(x => {
        return {
          type: GetContestStudentResultType.ok,
          data: x['data']
        };
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 404) {
          return of({ type: GetContestStudentResultType.contestNotFound, data: undefined });
        } else if (e.status === 401) {
          return of({ type: GetContestStudentResultType.unauthorized, data: undefined });
        } else {
          return of({ type: GetContestStudentResultType.error, data: undefined });
        }
      })
    );
  }

  adds(contestStudentInfos: ContestStudentInfo[]) {
    this.dialogService.isLoadingDialogActive = true;
    const csIds = contestStudentInfos.map(cs => {
      return { studentId: cs.studentId };
    });
    return this.http.post<AddContestStudentsResult>(this.contestStudentBaseUrl, csIds).pipe(
      finalize(() => (this.dialogService.isLoadingDialogActive = false)),
      map(x => {
        if (x['error'] === 0) {
          return { type: AddContestStudentResultType.ok, data: undefined };
        }
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 401 && e.error['error'] === AddContestStudentResultType.unauthorized) {
          return of({ type: AddContestStudentResultType.unauthorized, data: undefined });
        } else if (e.status === 403 && e.error['error'] === AddContestStudentResultType.forbiddance) {
          return of({ type: AddContestStudentResultType.forbiddance, data: undefined });
        } else if (e.status === 404 && e.error['error'] === AddContestStudentResultType.contestNotFound) {
          return of({ type: AddContestStudentResultType.contestNotFound, data: undefined });
        } else if (e.status === 404 && e.error['error'] === AddContestStudentResultType.studentsNotFound) {
          return of({ type: AddContestStudentResultType.studentsNotFound, notFoundList: e.error['data'] });
        } else if (e.status === 422 && e.error['error'] === AddContestStudentResultType.wrong) {
          return of({ type: AddContestStudentResultType.wrong, data: undefined });
        } else {
          return of({ type: AddContestStudentResultType.error, data: undefined });
        }
      })
    );
  }
}
