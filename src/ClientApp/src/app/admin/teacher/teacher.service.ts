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
  getUserType
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
  private baseUrl = '/api/user';

  constructor(private dialogService: DialogService, private http: HttpClient) {}

  get(id: number): Observable<UserInfo> {
    return this.http.get(`${this.baseUrl}/${id}`).pipe(
      map(x => {
        const b = x['data']['basicInfo'];
        const r = x['data']['roleCode'];
        return {
          id: b['id'],
          loginName: b['loginName'],
          userName: b['userName'],
          userType: getUserType(r)
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
      .get(this.baseUrl, {
        params: new HttpParams().set('roleCode', '0#1')
      })
      .pipe(
        map(x => {
          return x['data'].map(y => {
            const b = y['basicInfo'];
            const r = y['roleCode'];
            return {
              id: b['id'],
              loginName: b['loginName'],
              userName: b['userName'],
              userType: getUserType(r)
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
      roleCode: teacherInfo.userType
    };
    this.dialogService.isLoadingDialogActive = true;
    return this.http
      .put(`${this.baseUrl}/${teacherInfo.id}`, s, httpOptions)
      .pipe(
        finalize(() => {
          this.dialogService.isLoadingDialogActive = false;
        }),
        map(x => {
          if (x['error'] === '0') {
            const b = x['data']['basicInfo'];
            const r = x['data']['roleCode'];
            const user: UserInfo = {
              id: b['id'],
              loginName: b['loginName'],
              userName: b['userName'],
              password: b['password'],
              userType: getUserType(r)
            };
            this.teacherInfo = {
              loginName: '',
              userName: '',
              userType: undefined
            };
            this.teacherInfo.id = user.id;
            this.teacherInfo.loginName = user.loginName;
            this.teacherInfo.userName = user.userName;
            this.teacherInfo.userType = user.userType;
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
        roleCode: x.userType
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
