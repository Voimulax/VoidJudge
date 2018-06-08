import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import { catchError, finalize, map, startWith, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import {
  StudentInfo,
  StudentResultType,
  StudentResult,
  PutStudentResultType,
  DeleteStudentResultType
} from './student.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  studentInfo: StudentInfo;
  private baseUrl = '/api/user';

  constructor(private http: HttpClient) {}

  getStudent(id: number): Observable<StudentInfo> {
    return this.http
      .get(`${this.baseUrl}/${id}`, {
        params: new HttpParams().set('roleCode', '2')
      })
      .pipe(
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

  getStudents(): Observable<StudentInfo[]> {
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

  putStudent(studentInfo: StudentInfo): Observable<PutStudentResultType> {
    const s = {
      basicInfo: {
        id: studentInfo.id,
        loginName: studentInfo.loginName,
        userName: studentInfo.userName
      },
      roleCode: studentInfo.userType,
      claimInfos: [{ type: 'group', value: studentInfo.group }]
    };
    return this.http
      .put(`${this.baseUrl}/${studentInfo.id}`, s, httpOptions)
      .pipe(
        map(x => {
          if (x['error'] === '0') {
            return PutStudentResultType.ok;
          }
        }),
        catchError((e: HttpErrorResponse) => {
          if (e.status === 400 && e.error['error'] === '1') {
            return of(PutStudentResultType.concurrencyException);
          } else if (e.status === 404 && e.error['error'] === '2') {
            return of(PutStudentResultType.userNotFound);
          } else {
            return of(PutStudentResultType.error);
          }
        })
      );
  }

  addStudent(studentInfo: StudentInfo): Observable<StudentResult> {
    const sis = Array<StudentInfo>();
    sis.push(studentInfo);
    return this.addStudents(sis);
  }

  addStudents(studentInfos: Array<StudentInfo>): Observable<StudentResult> {
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
    return this.http.post(`${this.baseUrl}`, sis, httpOptions).pipe(
      map(x => {
        if (x['error'] === '0') {
          return { type: StudentResultType.ok };
        }
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 406 && e.error['error'] === '1') {
          return of({ type: StudentResultType.wrong });
        } else if (e.status === 406 && e.error['error'] === '2') {
          return of({
            type: StudentResultType.repeat,
            repeat: e.error['data']
          });
        } else {
          return of({ type: StudentResultType.error });
        }
      })
    );
  }

  deleteStudent(id: number): Observable<DeleteStudentResultType> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      map(x => {
        if (x['error'] === '0') {
          return DeleteStudentResultType.ok;
        }
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 403) {
          return of(DeleteStudentResultType.forbiddance);
        } else if (e.status === 404) {
          return of(DeleteStudentResultType.userNotFound);
        } else {
          return of(DeleteStudentResultType.error);
        }
      })
    );
  }
}
