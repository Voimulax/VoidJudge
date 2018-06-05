import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, startWith, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { StudentInfo } from './student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  currentStudentInfo: StudentInfo;
  private studentsUrl = '/api/students';

  constructor(private http: HttpClient) {}

  getStudent(id: number) {
    return this.http.get<StudentInfo>(`${this.studentsUrl}/${id}`).pipe(
      tap(data => {
        this.currentStudentInfo = data;
      })
    );
  }

  getStudentList() {
    return this.http
      .get<StudentInfo[]>(this.studentsUrl)
      .pipe(startWith(Array<StudentInfo>()));
  }
}
