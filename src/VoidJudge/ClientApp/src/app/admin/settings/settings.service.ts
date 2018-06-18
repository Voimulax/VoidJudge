import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { SettingsInfo, GetSettingsResultType, PutSettingsResultType } from './settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  settingsInfos: SettingsInfo[];
  private settingsBaseUrl = '/api/system/settings';

  constructor(private http: HttpClient) {}

  gets() {
    return this.http.get(this.settingsBaseUrl).pipe(
      map(r => {
        if (r['error'] === GetSettingsResultType.ok) {
          this.settingsInfos = r['data'];
          return { type: GetSettingsResultType.ok, data: r['data'] };
        }
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 404) {
          return of({ type: GetSettingsResultType.error, data: undefined });
        } else {
          return of({ type: GetSettingsResultType.error, data: undefined });
        }
      })
    );
  }

  puts(settingsInfos: SettingsInfo[]) {
    return this.http.put(this.settingsBaseUrl, settingsInfos).pipe(
      map(r => {
        if (r['error'] === PutSettingsResultType.ok) {
          return PutSettingsResultType.ok;
        }
      }),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 422) {
          return of(PutSettingsResultType.wrong);
        } else {
          return of(PutSettingsResultType.error);
        }
      })
    );
  }
}
