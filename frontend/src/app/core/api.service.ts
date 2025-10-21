import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api'; // <— IMPORTANT : relatif

  get<T>(url: string, options: object = {}): Observable<T> {
    return this.http.get<T>(this.baseUrl + url, options);
  }
  post<T>(url: string, body: any, options: object = {}): Observable<T> {
    return this.http.post<T>(this.baseUrl + url, body, options);
  }
  put<T>(url: string, body: any, options: object = {}): Observable<T> {
    return this.http.put<T>(this.baseUrl + url, body, options);
  }
  delete<T>(url: string, options: object = {}): Observable<T> {
    return this.http.delete<T>(this.baseUrl + url, options);
  }
}
