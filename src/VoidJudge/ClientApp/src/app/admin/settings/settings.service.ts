import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, startWith, tap, delay } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private contestUrl = '/api/admin/settings';

  constructor(private http: HttpClient) {}

  getSettings() {
    return of({ uploadLimit: 16384 }).pipe(delay(2000));
  }
}
