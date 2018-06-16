import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, tap, finalize } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import {
  PutResult,
  PutResultType,
  UserResult,
  UserResultType,
  DeleteResultType,
  UserInfo,
  getRoleType
} from '../../core/auth/user.model';
import { DialogService } from '../../shared/dialog/dialog.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  teacherInfo: UserInfo;
  private usersBaseUrl = '/api/users';

  constructor(private dialogService: DialogService, private http: HttpClient) {}

  get(id: number): Observable<UserInfo> {
    return this.http.get(`${this.usersBaseUrl}/${id}`).pipe(
      map(x => {
        return x['data'];
      }),
      tap(x => {
        this.teacherInfo = x;
      }),
      catchError((e: HttpErrorResponse) => {
        return of(null);
      })
    );
  }

  gets(): Observable<UserInfo[]> {
    return this.http
      .get(this.usersBaseUrl, {
        params: new HttpParams().set('roleType', '0#1')
      })
      .pipe(
        map(x => {
          return x['data'];
        }),
        catchError((e: HttpErrorResponse) => {
          return of(null);
        })
      );
  }

  put(teacherInfo: UserInfo): Observable<PutResult<UserInfo>> {
    this.dialogService.isLoadingDialogActive = true;
    return this.http.put(`${this.usersBaseUrl}/${teacherInfo.id}`, teacherInfo, httpOptions).pipe(
      finalize(() => {
        this.dialogService.isLoadingDialogActive = false;
      }),
      map(x => {
        if (x['error'] === 0) {
          this.teacherInfo = x['data'];
          return { type: PutResultType.ok, user: x['data'] };
        }
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 403 && e.error['error'] === PutResultType.forbiddance) {
          return of({ type: PutResultType.forbiddance });
        } else if (e.status === 400) {
          return of({ type: e.error['error'] });
        } else if (e.status === 404 && e.error['error'] === PutResultType.userNotFound) {
          return of({ type: PutResultType.userNotFound });
        } else {
          return of({ type: PutResultType.error });
        }
      })
    );
  }

  add(teacherInfo: UserInfo): Observable<UserResult> {
    const sis = Array<UserInfo>();
    sis.push(teacherInfo);
    return this.adds(sis);
  }

  adds(teacherInfos: Array<UserInfo>): Observable<UserResult> {
    this.dialogService.isLoadingDialogActive = true;
    return this.http.post(`${this.usersBaseUrl}`, teacherInfos, httpOptions).pipe(
      finalize(() => {
        this.dialogService.isLoadingDialogActive = false;
      }),
      map(x => {
        if (x['error'] === 0) {
          return { type: UserResultType.ok };
        }
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 422 && e.error['error'] === UserResultType.wrong) {
          return of({ type: UserResultType.wrong });
        } else if (e.status === 409 && e.error['error'] === UserResultType.repeat) {
          return of({
            type: UserResultType.repeat,
            repeat: e.error['data']
          });
        } else {
          return of({ type: UserResultType.error });
        }
      })
    );
  }

  delete(id: number): Observable<DeleteResultType> {
    this.dialogService.isLoadingDialogActive = true;
    return this.http.delete(`${this.usersBaseUrl}/${id}`).pipe(
      finalize(() => {
        this.dialogService.isLoadingDialogActive = false;
      }),
      map(x => {
        if (x['error'] === 0) {
          return DeleteResultType.ok;
        }
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 403) {
          return of(DeleteResultType.forbiddance);
        } else if (e.status === 404) {
          return of(DeleteResultType.userNotFound);
        } else {
          return of(DeleteResultType.error);
        }
      })
    );
  }
}
