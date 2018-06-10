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
  private userBaseUrl = '/api/user';

  constructor(private dialogService: DialogService, private http: HttpClient) {}

  get(id: number): Observable<UserInfo> {
    return this.http.get(`${this.userBaseUrl}/${id}`).pipe(
      map(x => {
        const b = x['data']['basicInfo'];
        const r = x['data']['roleType'];
        return {
          id: b['id'],
          loginName: b['loginName'],
          userName: b['userName'],
          roleType: getRoleType(r)
        };
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
      .get(this.userBaseUrl, {
        params: new HttpParams().set('roleType', '0#1')
      })
      .pipe(
        map(x => {
          return x['data'].map(y => {
            const b = y['basicInfo'];
            const r = y['roleType'];
            return {
              id: b['id'],
              loginName: b['loginName'],
              userName: b['userName'],
              roleType: getRoleType(r)
            };
          });
        }),
        catchError((e: HttpErrorResponse) => {
          return of(null);
        })
      );
  }

  put(teacherInfo: UserInfo): Observable<PutResult<UserInfo>> {
    const s = {
      basicInfo: {
        id: teacherInfo.id,
        loginName: teacherInfo.loginName,
        userName: teacherInfo.userName,
        password: teacherInfo.password
      },
      roleType: teacherInfo.roleType
    };
    this.dialogService.isLoadingDialogActive = true;
    return this.http
      .put(`${this.userBaseUrl}/${teacherInfo.id}`, s, httpOptions)
      .pipe(
        finalize(() => {
          this.dialogService.isLoadingDialogActive = false;
        }),
        map(x => {
          if (x['error'] === '0') {
            const b = x['data']['basicInfo'];
            const r = x['data']['roleType'];
            const user: UserInfo = {
              id: b['id'],
              loginName: b['loginName'],
              userName: b['userName'],
              password: b['password'],
              roleType: getRoleType(r)
            };
            this.teacherInfo = {
              loginName: '',
              userName: '',
              roleType: undefined
            };
            this.teacherInfo.id = user.id;
            this.teacherInfo.loginName = user.loginName;
            this.teacherInfo.userName = user.userName;
            this.teacherInfo.roleType = user.roleType;
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

  add(teacherInfo: UserInfo): Observable<UserResult> {
    const sis = Array<UserInfo>();
    sis.push(teacherInfo);
    return this.adds(sis);
  }

  adds(teacherInfos: Array<UserInfo>): Observable<UserResult> {
    const sis = teacherInfos.map(x => {
      return {
        basicInfo: {
          loginName: x.loginName,
          userName: x.userName,
          password: x.password
        },
        roleType: x.roleType
      };
    });
    this.dialogService.isLoadingDialogActive = true;
    return this.http.post(`${this.userBaseUrl}`, sis, httpOptions).pipe(
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
    return this.http.delete(`${this.userBaseUrl}/${id}`).pipe(
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
