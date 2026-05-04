import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const authKey = 'bff_shell_auth_session';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.clear();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
    jest.useRealTimers();
  });

  it('should login and save the session', () => {
    const credentials = { idUser: 12345, password: 'password123' };
    let savedSession: unknown;

    service.login(credentials).subscribe((session) => {
      savedSession = session;
    });

    const ipRequest = httpMock.expectOne(environment.deviceIpProviderUrl);
    ipRequest.flush({ ip: '192.168.1.10' });

    const loginRequest = httpMock.expectOne(`${environment.apiBaseUrl}/auth/login`);
    expect(loginRequest.request.method).toBe('POST');
    expect(loginRequest.request.body).toEqual(credentials);
    expect(loginRequest.request.headers.get('x-device-ip')).toBe('192.168.1.10');
    expect(loginRequest.request.headers.get('x-session')).toBeTruthy();

    loginRequest.flush({
      idUser: 12345,
      accessToken: 'token-abc',
      tokenType: 'Bearer',
      expiresIn: 3600,
    });

    expect(savedSession).toEqual(
      expect.objectContaining({
        authenticated: true,
        idUser: 12345,
        accessToken: 'token-abc',
        tokenType: 'Bearer',
        expiresIn: 3600,
        expiresAt: '2026-01-01T01:00:00.000Z',
        deviceIp: '192.168.1.10',
        createdAt: '2026-01-01T00:00:00.000Z',
      })
    );
    expect(JSON.parse(sessionStorage.getItem(authKey) ?? '{}')).toEqual(savedSession);
  });

  it('should say the user is not authenticated when there is no session', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getAccessToken()).toBeNull();
  });

  it('should return the access token when the session is valid', () => {
    sessionStorage.setItem(
      authKey,
      JSON.stringify({
        authenticated: true,
        accessToken: 'token-abc',
        expiresAt: '2026-01-01T00:10:00.000Z',
      })
    );

    expect(service.isAuthenticated()).toBe(true);
    expect(service.getAccessToken()).toBe('token-abc');
  });

  it('should remove expired sessions', () => {
    sessionStorage.setItem(
      authKey,
      JSON.stringify({
        authenticated: true,
        accessToken: 'token-abc',
        expiresAt: '2025-12-31T23:59:59.000Z',
      })
    );

    expect(service.isAuthenticated()).toBe(false);
    expect(sessionStorage.getItem(authKey)).toBeNull();
  });

  it('should remove invalid stored sessions', () => {
    sessionStorage.setItem(authKey, 'invalid-json');

    expect(service.isAuthenticated()).toBe(false);
    expect(sessionStorage.getItem(authKey)).toBeNull();
  });

  it('should logout by removing the session', () => {
    sessionStorage.setItem(authKey, JSON.stringify({ authenticated: true }));

    service.logout();

    expect(sessionStorage.getItem(authKey)).toBeNull();
  });
});
