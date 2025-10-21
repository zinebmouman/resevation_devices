import { Injectable, inject } from '@angular/core';
import { ApiService } from '../core/api.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

interface AuthResponse { token: string }
interface MeResponse { id: number; email: string; firstName?: string; lastName?: string }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private tokenKey = 'auth_token';
  private userIdKey = 'userid';

  register(payload: { name: string; email: string; password: string; confirmPassword: string }): Observable<void> {
    const body = {
      email: payload.email,
      password: payload.password,
      firstName: payload.name.split(' ')[0] || payload.name,
      lastName : payload.name.split(' ')[1] || ''
    };
    return this.api.post<AuthResponse>('/auth/register', body).pipe(
      tap(res => localStorage.setItem(this.tokenKey, res.token)),
      switchMap(() => this.fetchMeAndStore()),
      map(() => void 0)
    );
  }

  login(payload: { email: string; password: string }): Observable<void> {
    return this.api.post<AuthResponse>('/auth/login', payload).pipe(
      tap(res => localStorage.setItem(this.tokenKey, res.token)),
      switchMap(() => this.fetchMeAndStore()),
      map(() => void 0)
    );
  }

  private fetchMeAndStore(): Observable<void> {
    // Adapte l’URL si ton backend expose autrement l’utilisateur courant
    return this.api.get<MeResponse>('/users/me').pipe(
      tap(me => localStorage.setItem(this.userIdKey, String(me.id))),
      map(() => void 0)
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
  }

  get token(): string | null { return localStorage.getItem(this.tokenKey); }
  get userId(): string | null { return localStorage.getItem(this.userIdKey); }
}
