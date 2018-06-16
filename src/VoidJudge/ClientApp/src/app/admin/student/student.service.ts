import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, tap, finalize } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import {
  PutResult,
  PutUserResultType,
  AddUserResult,
  AddUserResultType,
  DeleteUserResultType,
  StudentInfo
} from '../../core/auth/user.model';
import { DialogService } from '../../shared/dialog/dialog.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  studentInfo: StudentInfo;
  private studentsBaseUrl = '/api/user/students';

  constructor(private dialogService: DialogService, private http: HttpClient) {}

  get(id: number): Observable<StudentInfo> {
    return this.http.get(`${this.studentsBaseUrl}/${id}`).pipe(
      map(x => {
        return x['data'];
      }),
      tap(x => {
        this.studentInfo = x;
      }),
      catchError((e: HttpErrorResponse) => {
        return of(null);
      })
    );
  }

  gets(): Observable<StudentInfo[]> {
    return this.http
      .get(this.studentsBaseUrl, {
        params: new HttpParams().set('roleType', '2')
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

  put(studentInfo: StudentInfo): Observable<PutResult<StudentInfo>> {
    this.dialogService.isLoadingDialogActive = true;
    return this.http.put(`${this.studentsBaseUrl}/${studentInfo.id}`, studentInfo, httpOptions).pipe(
      finalize(() => {
        this.dialogService.isLoadingDialogActive = false;
      }),
      map(x => {
        if (x['error'] === 0) {
          this.studentInfo = x['data'];
          return { type: PutUserResultType.ok, user: x['data'] };
        }
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 403 && e.error['error'] === PutUserResultType.forbiddance) {
          return of({ type: PutUserResultType.forbiddance });
        } else if (e.status === 400) {
          return of({ type: e.error['error'] });
        } else if (e.status === 404 && e.error['error'] === PutUserResultType.userNotFound) {
          return of({ type: PutUserResultType.userNotFound });
        } else {
          return of({ type: PutUserResultType.error });
        }
      })
    );
  }

  add(studentInfo: StudentInfo): Observable<AddUserResult> {
    const sis = Array<StudentInfo>();
    sis.push(studentInfo);
    return this.adds(sis);
  }

  adds(studentInfos: Array<StudentInfo>): Observable<AddUserResult> {
    this.dialogService.isLoadingDialogActive = true;
    return this.http.post(`${this.studentsBaseUrl}`, studentInfos, httpOptions).pipe(
      finalize(() => {
        this.dialogService.isLoadingDialogActive = false;
      }),
      map(x => {
        if (x['error'] === 0) {
          return { type: AddUserResultType.ok };
        }
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 422 && e.error['error'] === AddUserResultType.wrong) {
          return of({ type: AddUserResultType.wrong });
        } else if (e.status === 409 && e.error['error'] === AddUserResultType.repeat) {
          return of({
            type: AddUserResultType.repeat,
            repeat: e.error['data']
          });
        } else {
          return of({ type: AddUserResultType.error });
        }
      })
    );
  }

  delete(id: number): Observable<DeleteUserResultType> {
    this.dialogService.isLoadingDialogActive = true;
    return this.http.delete(`${this.studentsBaseUrl}/${id}`).pipe(
      finalize(() => {
        this.dialogService.isLoadingDialogActive = false;
      }),
      map(x => {
        if (x['error'] === 0) {
          return DeleteUserResultType.ok;
        }
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 403) {
          return of(DeleteUserResultType.forbiddance);
        } else if (e.status === 404) {
          return of(DeleteUserResultType.userNotFound);
        } else {
          return of(DeleteUserResultType.error);
        }
      })
    );
  }
}
