import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import { catchError, map, tap, finalize } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import {
  PutResult,
  PutResultType,
  UserResult,
  UserResultType,
  DeleteResultType,
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
  private baseUrl = '/api/user';

  constructor(private dialogService: DialogService, private http: HttpClient) {}

  get(id: number): Observable<StudentInfo> {
    return this.http.get(`${this.baseUrl}/${id}`).pipe(
      map(x => {
        const b = x['data']['basicInfo'];
        const g = x['data']['claimInfos'].find(y => y['type'] === 'group');
        return {
          id: b['id'],
          loginName: b['loginName'],
          userName: b['userName'],
          group: g['value']
        };
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
      .get(this.baseUrl, {
        params: new HttpParams().set('roleCode', '2')
      })
      .pipe(
        map(x => {
          return x['data'].map(y => {
            const b = y['basicInfo'];
            const g = y['claimInfos'].find(z => z['type'] === 'group');
            return {
              id: b['id'],
              loginName: b['loginName'],
              userName: b['userName'],
              group: g['value']
            };
          });
        }),
        catchError((e: HttpErrorResponse) => {
          return of(null);
        })
      );
  }

  put(studentInfo: StudentInfo): Observable<PutResult<StudentInfo>> {
    const s = {
      basicInfo: {
        id: studentInfo.id,
        loginName: studentInfo.loginName,
        userName: studentInfo.userName,
        password: studentInfo.password
      },
      roleCode: studentInfo.userType,
      claimInfos: [{ type: 'group', value: studentInfo.group }]
    };
    this.dialogService.isLoadingDialogActive = true;
    return this.http
      .put(`${this.baseUrl}/${studentInfo.id}`, s, httpOptions)
      .pipe(
        finalize(() => {
          this.dialogService.isLoadingDialogActive = false;
        }),
        map(x => {
          if (x['error'] === '0') {
            const b = x['data']['basicInfo'];
            const g = x['data']['claimInfos'].find(y => y['type'] === 'group');
            const user: StudentInfo = {
              id: b['id'],
              loginName: b['loginName'],
              userName: b['userName'],
              group: g['value'],
              password: b['password']
            };
            this.studentInfo = { loginName: '', userName: '', group: '' };
            this.studentInfo.id = user.id;
            this.studentInfo.loginName = user.loginName;
            this.studentInfo.userName = user.userName;
            this.studentInfo.group = user.group;
            return { type: PutResultType.ok, user: user };
          }
        }),
        catchError((e: HttpErrorResponse) => {
          if (e.status === 400 && e.error['error'] === '1') {
            return of({ type: PutResultType.concurrencyException });
          } else if (e.status === 404 && e.error['error'] === '2') {
            return of({ type: PutResultType.userNotFound });
          } else {
            return of({ type: PutResultType.error });
          }
        })
      );
  }

  add(studentInfo: StudentInfo): Observable<UserResult> {
    const sis = Array<StudentInfo>();
    sis.push(studentInfo);
    return this.adds(sis);
  }

  adds(studentInfos: Array<StudentInfo>): Observable<UserResult> {
    const sis = studentInfos.map(x => {
      return {
        basicInfo: {
          loginName: x.loginName,
          userName: x.userName,
          password: x.password
        },
        roleCode: x.userType,
        claimInfos: [{ type: 'group', value: x.group }]
      };
    });
    this.dialogService.isLoadingDialogActive = true;
    return this.http.post(`${this.baseUrl}`, sis, httpOptions).pipe(
      finalize(() => {
        this.dialogService.isLoadingDialogActive = false;
      }),
      map(x => {
        if (x['error'] === '0') {
          return { type: UserResultType.ok };
        }
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 406 && e.error['error'] === '1') {
          return of({ type: UserResultType.wrong });
        } else if (e.status === 406 && e.error['error'] === '2') {
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
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      finalize(() => {
        this.dialogService.isLoadingDialogActive = false;
      }),
      map(x => {
        if (x['error'] === '0') {
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
