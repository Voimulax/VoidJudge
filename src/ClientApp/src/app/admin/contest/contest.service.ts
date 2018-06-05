import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, startWith, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ContestInfo } from './contest.model';

@Injectable({
  providedIn: 'root'
})
export class ContestService {
  private contestUrl = '/api/contest';

  constructor(private http: HttpClient) {}

  getContestList() {
    return this.http
      .get<ContestInfo[]>(this.contestUrl)
      .pipe(startWith(Array<ContestInfo>()));
  }
}
