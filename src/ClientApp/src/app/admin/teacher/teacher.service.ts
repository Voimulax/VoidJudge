import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, startWith, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { TeacherInfo } from './teacher.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  currentTeacherInfo: TeacherInfo;
  private teachersUrl = '/api/teachers';

  constructor(private http: HttpClient) {}

  getTeacher(id: number) {
    return this.http.get<TeacherInfo>(`${this.teachersUrl}/${id}`).pipe(
      tap(data => {
        this.currentTeacherInfo = data;
      })
    );
  }

  getTeacherList() {
    return this.http
      .get<TeacherInfo[]>(this.teachersUrl)
      .pipe(startWith(Array<TeacherInfo>()));
  }
}
