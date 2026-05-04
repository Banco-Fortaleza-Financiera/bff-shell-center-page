import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthSession } from '../interfaces/auth-session.interface';
import { LoginCredentials } from '../interfaces/login-credentials.interface';
import { LoginResponse } from '../interfaces/login-response.interface';
import { generateUuidV4 } from '../utils/uuid-v4.util';
import { DeviceInfoService } from './device-info.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authKey = 'bff_shell_auth_session';
  private readonly http = inject(HttpClient);
  private readonly deviceInfoService = inject(DeviceInfoService);

  login(credentials: LoginCredentials): Observable<AuthSession> {
    const sessionId = generateUuidV4();

    return this.deviceInfoService.getPublicIp().pipe(
      switchMap((deviceIp) =>
        this.http
          .post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, credentials, {
            headers: new HttpHeaders({
              'x-device-ip': deviceIp,
              'x-session': sessionId,
            }),
          })
          .pipe(
            map((response) => ({
              authenticated: true as const,
              idUser: response.idUser,
              accessToken: response.accessToken,
              tokenType: response.tokenType,
              expiresIn: response.expiresIn,
              expiresAt: new Date(Date.now() + response.expiresIn * 1000).toISOString(),
              sessionId,
              deviceIp,
              createdAt: new Date().toISOString(),
            }))
          )
      ),
      tap((session) => this.saveSession(session))
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.authKey);
  }

  isAuthenticated(): boolean {
    const session = this.getSession();

    if (!session?.authenticated) {
      return false;
    }

    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      this.logout();
      return false;
    }

    return true;
  }

  getAccessToken(): string | null {
    if (!this.isAuthenticated()) {
      return null;
    }

    return this.getSession()?.accessToken ?? null;
  }

  private getSession(): AuthSession | null {
    const rawSession = sessionStorage.getItem(this.authKey);

    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as AuthSession;
    } catch {
      this.logout();
      return null;
    }
  }

  private saveSession(session: AuthSession): void {
    sessionStorage.setItem(this.authKey, JSON.stringify(session));
  }
}
